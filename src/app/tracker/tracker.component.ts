import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore, DocumentData, QueryFn } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { documentId } from 'firebase/firestore';
import * as _ from 'lodash';
import { map, Subscription } from 'rxjs';
import { DayOfWeek, DisplayableEntry } from '../model/DisplayableEntry';
import { IProject } from '../model/IProject';
import { Project } from '../model/project';
import { TimeEntry } from '../model/time-entry';
import { TimeSheet } from '../model/timesheet';
import { TimeUtil } from '../util/time-util';
import { DurationTimeEntryDialogComponent } from './duration-time-entry-dialog/duration-time-entry-dialog.component';
import { NotesDialogComponent } from './notes-dialog/notes-dialog.component';

@Component({
    selector: 'tymer-tracker',
    templateUrl: './tracker.component.html',
    styleUrls: ['./tracker.component.scss']
})
export class TrackerComponent implements OnInit, OnDestroy {
    private subs = new Subscription();

    today: Date = new Date();
    tymerStart: Date | null = null;

    projects!: IProject[];
    timeSheet?: TimeSheet;

    timeEntriesDataSource = new MatTableDataSource<DisplayableEntry>();
    tableColumns = ['project', 'sun', 'mon', 'tue', 'wed', 'thur', 'fri', 'sat'];
    tableColumnsInput: string[] = [];
    tableFooterColumns = ['total'];

    // Only show the dates for the current timeSheet
    datePickerFilter = (d: Date | null): boolean => {
        const dateTime = d?.getTime()!;
        return dateTime >= this.timeSheet!.startDate.getTime() && dateTime <= this.timeSheet!.endDate.getTime();
    }

    constructor(
        private route: ActivatedRoute,
        private db: AngularFirestore,
        public dialog: MatDialog
    ) {
        this.tableColumns.forEach(column => {
            this.tableColumnsInput.push(column + '-input');
        });
    }

    private _getTimeSheetRange() {
        const sundayDate = this.today.getDate() - this.today.getDay();

        const startDate = new Date(this.today);
        startDate.setDate(sundayDate);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(0, 0, 0, 0);

        return [startDate, endDate];
    }

    ngOnInit(): void {
        const projectId = this.route.snapshot.paramMap.get('id');
        let projectQuery: QueryFn<DocumentData> | undefined;

        if (projectId) {
            projectQuery = (ref) => ref.where(documentId(), '==', projectId);
        }
        const timeSheetRange = this._getTimeSheetRange();
        this.subs.add(Project.Collection(this.db, projectQuery).valueChanges({ idField: 'id' }).subscribe(projects => {
            this.projects = projects;

            // Get the timesheet for this week
            // this.subs.add(TimeSheet.Collection(this.db, (ref) => ref.where('startDate', '==', timeSheetRange[0]).where('endDate', '==', timeSheetRange[1])).valueChanges({ idField: 'id' })
            this.subs.add(TimeSheet.Collection(this.db, (ref) => ref.where('isSubmitted', '==', false)).valueChanges({ idField: 'id' })
                .pipe(map(ts => ts[0]), map(ts => ts ? TimeSheet.fromFirebase(ts) : null))
                .subscribe(async timeSheet => {
                    // Create the timeSheet for the week
                    if (!timeSheet) {
                        const toAdd = new TimeSheet(undefined, timeSheetRange[0], timeSheetRange[1], [], false);
                        await TimeSheet.Collection(this.db).add(toAdd.toFirebase());
                        return;
                    }
                    this.timeSheet = timeSheet;
                    console.log(this.timeSheet);

                    let entries = timeSheet.entries;
                    // Add a blank entry for a new entry in the UI
                    // Filter timeEntries based off project name if there is only 1 project
                    if (this.projects.length == 1) {
                        const project = this.projects[0];
                        entries = _.filter(entries, te => te.project == project!.name);
                    }

                    // Convert entries to the DisplayableEntries
                    const des = this._parseTimeEntries(entries);
                    // Fill in the remaining empty TimeEntries
                    des.forEach(de => {
                        for (const dayOfWeek of [0, 1, 2, 3, 4, 5, 6] as DayOfWeek[]) {
                            if (!de[dayOfWeek]) {
                                const date = new Date(this.timeSheet!.startDate);
                                const entry = new TimeEntry(de.project, 0, '', new Date(date.setDate(this.timeSheet!.startDate.getDate() + dayOfWeek)));
                                entries.push(entry);
                                de[dayOfWeek] = entry;
                            }
                        }
                    });

                    // Add a new row
                    this._addNewDisplayableEntries(des, entries);
                    this.timeSheet.entries = entries;
                    this.timeEntriesDataSource.data = des;
                }));
        }));
    }

    private _addNewDisplayableEntries(displayableEntries: DisplayableEntry[], entries: TimeEntry[]) {
        const displayableEntry = new DisplayableEntry();
        displayableEntry.project = null;
        for (const dayOfWeek of [0, 1, 2, 3, 4, 5, 6] as DayOfWeek[]) {
            const date = new Date(this.timeSheet!.startDate);
            const entry = new TimeEntry(null, 0, '', new Date(date.setDate(this.timeSheet!.startDate.getDate() + dayOfWeek)));
            entries.push(entry);
            displayableEntry[dayOfWeek] = entry;
        }
        displayableEntries.unshift(displayableEntry);

        return displayableEntry;
    }

    private _parseTimeEntries(entries: TimeEntry[]): DisplayableEntry[] {
        let currentProjectsDEs: { [project: string]: DisplayableEntry[] } = {};
        entries.forEach(te => {
            let projectDEs = currentProjectsDEs[te.project!];
            // If there are no DisplayableEntries for the current project, add one
            if (!projectDEs) {
                projectDEs = [];
                const de = new DisplayableEntry();
                de.project = te.project!;
                currentProjectsDEs[te.project!] = projectDEs;
            }

            // Go through each of the projectDEs and add the current TE to the one that has the day open
            let didAdd = false;
            for (const projectDE of projectDEs) {
                if (didAdd = this._attempAddTimeEntryToDisplayableEntry(te, projectDE)) {
                    break;
                }
            }

            if (!didAdd) {
                const displayableEntry = new DisplayableEntry();
                this._attempAddTimeEntryToDisplayableEntry(te, displayableEntry);
                projectDEs.push(displayableEntry);
            }
        });

        return _.flatMap(currentProjectsDEs);
    }

    private _attempAddTimeEntryToDisplayableEntry(te: TimeEntry, entry: DisplayableEntry) {
        const dayOfWeek = te.date.getDay();
        const timeEntryForDay = entry[dayOfWeek as DayOfWeek];

        // If there is not time entry, or there is no notes it is up for the taking
        if (!timeEntryForDay || !timeEntryForDay.notes || timeEntryForDay.notes.length == 0) {
            entry.project = te.project!;
            entry[dayOfWeek as DayOfWeek] = te;
            return true;
        }

        return false;
    }

    updateDisplayableTimeEntry(de: DisplayableEntry, project: string) {
        for (const dayOfWeek of [0, 1, 2, 3, 4, 5, 6] as DayOfWeek[]) {
            de[dayOfWeek].project = project;
        }
    }

    openNotesDialog(timeEntry: TimeEntry) {
        const dialogRef = this.dialog.open(NotesDialogComponent, {
            width: '75%',
            data: { notes: timeEntry.notes }
        });

        dialogRef.afterClosed().subscribe(notes => {
            if (notes && notes != timeEntry.notes) {
                timeEntry.notes = notes;

                this.parseAndSaveTimeSheet(this.timeEntriesDataSource.data);
            }
        });
    }

    async parseAndSaveTimeSheet(displayableEntries: DisplayableEntry[]) {
        const finalEntries: TimeEntry[] = _.chain(displayableEntries).map(de => de.getTimeEntries().filter(te => te.duration > 0)).flatMap().map(entry => {
            entry.duration = TimeUtil.MillisToHours(TimeUtil.ClampToQuarter(TimeUtil.HoursToMillis(entry.duration)));

            return entry;
        }).value();
        this.timeSheet!.entries = finalEntries;
        await this.saveTimeSheet(this.timeSheet!);
    }

    async submitTimeSheet() {
        this.timeSheet!.isSubmitted = true;
        await this.parseAndSaveTimeSheet(this.timeEntriesDataSource.data);
    }

    async saveTimeSheet(toSave: TimeSheet) {
        await TimeSheet.Collection(this.db).doc(toSave.id).update(toSave.toFirebase());
    }

    getTotalHours(dayOfWeek: DayOfWeek) {
        let hours = this.timeEntriesDataSource.data.map(t => t[dayOfWeek] ? t[dayOfWeek].duration : 0).reduce((acc, value) => acc + value, 0);
        return TimeUtil.Round(hours); // Should already be rounded since we don't allow anything other than whole numbers and .25 but y'know
    }

    startTymer() {
        this.tymerStart = new Date();

        // Open the modal to allow for entering notes during the tracking
        this._openTymerModalAsync(null); // null means the duration will be calculated when the modal is closed
    }

    stopTymer() {
        const durationInMs = TimeUtil.DifferenceFromNow(+this.tymerStart!);
        const duration = TimeUtil.MillisToHours(durationInMs);

        if (duration > 0) {
            this._openTymerModalAsync(duration);
        }
        this.tymerStart = null;
    }

    private async _openTymerModalAsync(duration: number | null = null) {
        const dialogRef = this.dialog.open(DurationTimeEntryDialogComponent, {
            width: '80%',
            data: {
                duration: duration,
                projects: this.projects
            }
        });

        dialogRef.afterClosed().subscribe((timeEntry: TimeEntry) => {
            if (timeEntry) {
                if (!duration) {
                    let durationInMs = TimeUtil.DifferenceFromNow(+this.tymerStart!);
                    durationInMs = TimeUtil.ClampToQuarter(durationInMs);

                    duration = TimeUtil.MillisToHours(durationInMs);
                    this.tymerStart = null;
                }

                if (duration == 0) {
                    console.log('Oopsies, you should probably do a little more work');
                    return;
                }

                timeEntry.duration = duration;

                this._handleTymerModalEntry(timeEntry);
            }
        });
    }

    private _handleTymerModalEntry(entry: TimeEntry) {
        let didAdd = false;
        for (const de of this.timeEntriesDataSource.data.filter(de => de.project == entry.project)) {
            if (didAdd = this._attempAddTimeEntryToDisplayableEntry(entry, de)) {
                break;
            }
        }
        if (!didAdd) {
            const de = this._addNewDisplayableEntries(this.timeEntriesDataSource.data, this.timeSheet!.entries);
            this._attempAddTimeEntryToDisplayableEntry(entry, de);
        }
        this.parseAndSaveTimeSheet(this.timeEntriesDataSource.data);
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

}

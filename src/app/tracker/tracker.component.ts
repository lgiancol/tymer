import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentData, QueryFn } from '@angular/fire/compat/firestore';
import { collectionData } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { addDoc, documentId, FieldPath } from 'firebase/firestore';
import { debounce, debounceTime, map, Subscription } from 'rxjs';
import { IProject } from '../model/IProject';
import { ITimeEntry } from '../model/ITimeEntry';
import { Project } from '../model/project';
import { TimeEntry } from '../model/time-entry';
import { NotesDialogComponent } from './notes-dialog/notes-dialog.component';
import * as _ from 'lodash';
import { ITimeSheet } from '../model/ITimeSheet';
import { TimeSheet } from '../model/timesheet';

@Component({
    selector: 'tymer-tracker',
    templateUrl: './tracker.component.html',
    styleUrls: ['./tracker.component.scss']
})
export class TrackerComponent implements OnInit, OnDestroy {
    private timeEntryCollection!: AngularFirestoreCollection<ITimeEntry>;
    private timeSheetCollection!: AngularFirestoreCollection<ITimeSheet>;
    private subs = new Subscription();

    projects!: IProject[];
    timeSheet!: TimeSheet;

    timeEntriesDataSource = new MatTableDataSource<ITimeEntry>();
    tableColumns = ['project', 'date', 'duration'];
    tableColumnsInput: string[] = [];
    tableFooterColumns = ['total'];

    projectControl = new FormControl();
    durationControl = new FormControl();
    notesControl = new FormControl('');
    dateControl = new FormControl(new Date());
    // Only show the dates for the current timeSheet
    datePickerFilter = (d: Date | null): boolean => {
        const dateTime = d?.getTime()!;
        return dateTime >= this.timeSheet?.startDate.getTime() && dateTime <= this.timeSheet?.endDate.getTime();
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
        const today = new Date();
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 0);

        const startDate = new Date(today.setDate(diff));
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
        this.subs.add(Project.Collection(this.db, projectQuery).valueChanges({ idField: 'id' }).subscribe(projects => {
            this.projects = projects;

            // Get the timesheet for this week
            const timeSheetRange = this._getTimeSheetRange();
            TimeSheet.Collection(this.db, (ref) => ref.where('startDate', '==', timeSheetRange[0]).where('endDate', '==', timeSheetRange[1]).limit(1)).valueChanges({ idField: 'id' }).pipe(debounceTime(100), map(ts => ts[0]), map(ts => ts ? TimeSheet.fromFirebase(ts) : null)).subscribe(async timeSheet => {
                // Create the timeSheet for the week
                if (!timeSheet) {
                    const toAdd = new TimeSheet(undefined, timeSheetRange[0], timeSheetRange[1], []);
                    await TimeSheet.Collection(this.db).add(toAdd.toFirebase());
                    return;
                }
                this.timeSheet = timeSheet;
                let entries = timeSheet.entries;

                // Filter timeEntries based off project name if there is only 1 project
                if (this.projects.length == 1) {
                    const project = this.projects[0];
                    entries = _.filter(entries, te => te.project == project.name);
                    this.projectControl.setValue(project);
                    this.projectControl.disable();
                }
                entries = _.orderBy(entries, ['project', 'date'], ['asc', 'desc']);
                
                this.timeEntriesDataSource.data = entries;
            });
        }));
    }

    openNotesDialog(notes?: string) {
        const dialogRef = this.dialog.open(NotesDialogComponent, {
            width: '75%',
            data: { notes }
        });

        dialogRef.afterClosed().subscribe(notes => {
            this.notesControl.setValue(notes);
        });
    }

    async saveTimeEntry() {
        const timeEntry = new TimeEntry(
            this.projectControl.value!.name,
            this.durationControl.value,
            this.notesControl.value!,
            this.dateControl.value!
        );
        this.timeSheet.entries.push(timeEntry);
        await TimeSheet.Collection(this.db).doc(this.timeSheet.id).update(this.timeSheet.toFirebase());

        this.projectControl.setValue(null);
        this.durationControl.setValue('');
        this.notesControl.setValue('');
        this.dateControl.setValue(new Date());
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    getTotalHours() {
        return this.timeEntriesDataSource.data.map(t => t.duration).reduce((acc, value) => acc + value, 0);
    }

}

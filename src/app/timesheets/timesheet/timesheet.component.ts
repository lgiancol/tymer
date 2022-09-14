import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { map, Subscription } from 'rxjs';
import { TimeEntry } from 'src/app/model/time-entry';
import { TimeSheet } from 'src/app/model/timesheet';

import * as _ from 'lodash';
import { ExportedTimeSheetDialogComponent } from 'src/app/dialogs/exported-time-sheet-dialog/exported-time-sheet-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'tymer-timesheet',
    templateUrl: './timesheet.component.html',
    styleUrls: ['./timesheet.component.scss']
})
export class TimesheetComponent implements OnInit, OnDestroy {
    private sub = new Subscription();

    projectNames!: string[];
    projectFilter = '';

    timeSheet!: TimeSheet;
    timeSheetEntries = new MatTableDataSource<TimeEntry>();
    columnNames = ['project', 'duration', 'notes', 'date'];

    exportedEntries!: TimeEntry[];
    totalDuration = 0;

    constructor(
        private route: ActivatedRoute,
        private firestore: AngularFirestore,
        public dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.sub.add(TimeSheet.Collection(this.firestore).doc(this.route.snapshot.params['id']).valueChanges({ idfield: 'id' }).pipe(map(ts => TimeSheet.fromFirebase(ts))).subscribe(timeSheet => {
            this.timeSheet = timeSheet as TimeSheet;
            this.projectNames = _.chain(this.timeSheet.entries).map('project').uniq().value() as string[];
            this.timeSheetEntries.filterPredicate = (entry: TimeEntry, filter: string) => entry.project?.includes(filter) || false;
            this.timeSheetEntries.data = _.sortBy(timeSheet?.entries as TimeEntry[], ['date']);
            this._parseExportedEntries(this.timeSheetEntries.filteredData);
        }));
    }

    updateFilter(filter: string) {
        this.timeSheetEntries.filter = filter;
        this._parseExportedEntries(this.timeSheetEntries.filteredData);
    }

    private _parseExportedEntries(entries: TimeEntry[]) {
        const entriesByDate = _.groupBy(entries, entry => entry.date.getTime());
        this.totalDuration = 0;

        this.exportedEntries = Object.entries(entriesByDate).map(entry => {
            const date = entry[0];
            const totalDuration = entry[1].reduce((acc, value) => acc + value.duration, 0);

            this.totalDuration += totalDuration;

            return new TimeEntry(null, totalDuration, '', new Date(Number(date)));
        });
    }

    exportTimeEntries() {

        this.dialog.open(ExportedTimeSheetDialogComponent, {
            data: { timeSheet: this.timeSheet }
        });
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

}

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from 'lodash';
import { TimeEntry } from 'src/app/model/time-entry';
import { TimeSheet } from 'src/app/model/timesheet';

@Component({
    selector: 'tymer-text-displayer-dialog',
    templateUrl: './exported-time-sheet-dialog.component.html',
    styleUrls: ['./exported-time-sheet-dialog.component.scss']
})
export class ExportedTimeSheetDialogComponent {
    timeSheet: TimeSheet;
    combinedTimeEntries: TimeEntry[];
    totalDuration = 0;

    constructor(
        public dialogRef: MatDialogRef<ExportedTimeSheetDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { timeSheet: TimeSheet },
    ) {
        this.timeSheet = data.timeSheet;
        this.combinedTimeEntries = this._parseExportedEntries(this.timeSheet.entries);
    }

    private _parseExportedEntries(entries: TimeEntry[]) {
        const entriesByDate = _.groupBy(entries, entry => entry.date.getTime());

        return Object.entries(entriesByDate).map(entry => {
            const date = entry[0];
            const totalDateDuration = entry[1].reduce((acc, value) => acc + value.duration, 0);

            this.totalDuration += totalDateDuration;

            return new TimeEntry(null, this.totalDuration, '', new Date(Number(date)));
        });
    }

}

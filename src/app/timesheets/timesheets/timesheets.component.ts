import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Subscription } from 'rxjs';
import { TimeSheet } from 'src/app/model/timesheet';
import * as _ from 'lodash';

@Component({
    selector: 'tymer-timesheets',
    templateUrl: './timesheets.component.html',
    styleUrls: ['./timesheets.component.scss']
})
export class TimesheetsComponent implements OnInit, OnDestroy {
    private subs = new Subscription();

    timeSheets?: TimeSheet[];

    constructor(
        private firebase: AngularFirestore
    ) { }

    ngOnInit(): void {
        this.subs.add(TimeSheet.Collection(this.firebase, (ref) => ref.where('isSubmitted', '==', true).orderBy('startDate', 'desc')).valueChanges({ idField: 'id' }).pipe(map(ts => ts.map(ts => TimeSheet.fromFirebase(ts)))).subscribe(timeSheets => {
            if (timeSheets != null) {
                this.timeSheets = timeSheets as TimeSheet[];
            }
        }));
    }

    // private _initTimeSheets(timeSheets: TimeSheet[]) {
    //     this.timeSheets = _.orderBy(timeSheets, 'startDate', 'desc');
    // }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

}

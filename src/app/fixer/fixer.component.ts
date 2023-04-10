import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subscription, map } from 'rxjs';
import { TimeSheet } from '../model/timesheet';

@Component({
  selector: 'tymer-fixer',
  templateUrl: './fixer.component.html',
  styleUrls: ['./fixer.component.scss']
})
export class FixerComponent implements OnInit {
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

}

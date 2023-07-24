import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { TimeSheet } from '../model/timesheet';
import { deleteDoc } from 'firebase/firestore';

@Component({
  selector: 'tymer-debug-page',
  templateUrl: './debug-page.component.html',
  styleUrls: ['./debug-page.component.scss'],
})
export class DebugPageComponent {
  constructor(private firestore: AngularFirestore) {}

  async fixOldEmptyTimesheets() {
    const batch = this.firestore.firestore.batch();
    TimeSheet.Collection(this.firestore, (ref) => {
      return ref.where('isSubmitted', '==', false).where('entries', '==', []);
    })
      .get()
      .subscribe(async (emptyTimesheets) => {
        emptyTimesheets.forEach((doc) => batch.delete(doc.ref));

        await batch.commit();

        console.log(`Deleted ${emptyTimesheets.size} empty docs`);
      });
  }
}

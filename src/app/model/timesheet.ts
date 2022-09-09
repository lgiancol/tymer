import { AngularFirestore, DocumentData, QueryFn } from "@angular/fire/compat/firestore";
import { BaseEntity } from "./BaseEntity";
import { ITimeSheet } from "./ITimeSheet";
import { TimeEntry } from "./time-entry";

export class TimeSheet extends BaseEntity implements ITimeSheet {
    constructor(
        public id: string | undefined,
        public startDate: Date,
        public endDate: Date,
        public entries: TimeEntry[]
    ) {
        super();
    }

    static Collection(firestore: AngularFirestore, query?: QueryFn<DocumentData>) {
        return firestore.collection<ITimeSheet>('time-sheets', query);
    }

    static fromFirebase(model: DocumentData | undefined) {
        if(!model) {
            return null;
        }
        let startDate = new Date();
        startDate.setTime(model['startDate']['seconds'] * 1000); // Multiple by 1000 since we need milliseconds, not seconds
        let endDate = new Date();
        endDate.setTime(model['endDate']['seconds'] * 1000); // Multiple by 1000 since we need milliseconds, not seconds
        let timeEntryModels = model['entries'] as any[];
        return new TimeSheet(model['id'], startDate, endDate, timeEntryModels.map(timeEntryModel => TimeEntry.fromFirebase(timeEntryModel)).filter(te => te != null) as TimeEntry[]);
    }

    toFirebase() {
        return {
            startDate: this.startDate,
            endDate: this.endDate,
            entries: this.entries.map(te => te.toFirebase())
        };
    }
}

import { AngularFirestore, DocumentData, QueryFn } from "@angular/fire/compat/firestore";
import { BaseEntity } from "./BaseEntity";
import { ITimeEntry } from "./ITimeEntry";

export class TimeEntry extends BaseEntity implements ITimeEntry {
    constructor(
        public project: string,
        public duration: number,
        public notes: string,
        public date: Date
    ) {
        super();
    }

    static Collection(firestore: AngularFirestore, query?: QueryFn<DocumentData>) {
        return firestore.collection<TimeEntry>('time-entry', query);
    }

    static fromFirebase(model: DocumentData) {
        const date = new Date();
        date.setTime(model['date']['seconds'] * 1000); // Multiple by 1000 since we need milliseconds, not seconds
        return new TimeEntry(model['project'], model['duration'], model['notes'], date);
    }

    toFirebase() {
        return {
            project: this.project,
            duration: this.duration,
            notes: this.notes,
            date: this.date
        };
    }
}

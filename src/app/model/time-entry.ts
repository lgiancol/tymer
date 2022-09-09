import { DocumentData } from "@angular/fire/compat/firestore";
import { ITimeEntry } from "./ITimeEntry";

import * as _ from 'lodash';

export class TimeEntry implements ITimeEntry {
    constructor(
        public project: string | null,
        public duration: number,
        public notes: string,
        public date: Date
    ) {
    }

    static fromFirebase(model: DocumentData | undefined) {
        if(!model) {
            return null;
        }
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

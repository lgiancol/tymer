import { TimeEntry } from "./time-entry";

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export class DisplayableEntry {
    public project: string | null = null;
    public 0: TimeEntry; // Sunday
    public 1!: TimeEntry; // Monday
    public 2!: TimeEntry; // Tuesday
    public 3!: TimeEntry; // Wednesday
    public 4!: TimeEntry; // Thursday
    public 5!: TimeEntry; // Friday
    public 6!: TimeEntry; // Saturday

    getTimeEntries() {
        return [
            this[0],
            this[1],
            this[2],
            this[3],
            this[4],
            this[5],
            this[6]
        ];
    }
}
import { IEntity } from "./IEntity";
import { ITimeEntry } from "./ITimeEntry";
import { TimeEntry } from "./time-entry";

export interface ITimeSheet extends IEntity{
    id?: string;
    startDate: Date;
    endDate: Date;
    entries: ITimeEntry[];
}
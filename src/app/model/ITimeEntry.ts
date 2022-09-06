import { IEntity } from "./IEntity";

export interface ITimeEntry extends IEntity{
    project: string | null;
    duration: number;
    notes: string;
    date: Date;
}
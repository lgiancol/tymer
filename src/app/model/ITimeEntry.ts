import { IEntity } from "./IEntity";

export interface ITimeEntry extends IEntity{
    project: string;
    duration: number;
    notes: string;
    date: Date;
}
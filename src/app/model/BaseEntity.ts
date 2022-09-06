import { DocumentData } from "@angular/fire/compat/firestore";

export abstract class BaseEntity{
    abstract toFirebase(): DocumentData;
}
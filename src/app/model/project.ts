import { AngularFirestore, DocumentData, QueryDocumentSnapshot, QueryFn, SnapshotOptions } from "@angular/fire/compat/firestore";
import firebase from "firebase/compat";
import { BaseEntity } from "./BaseEntity";
import { IProject } from "./IProject";

export class Project extends BaseEntity implements IProject{
    constructor(
        public name: string
    ) {
        super();
    }

    static fromFirebase(model: firebase.firestore.DocumentData) {
        return new Project(model['name']);
    }

    static Collection(firestore: AngularFirestore, query?: QueryFn<DocumentData>) {
        return firestore.collection<IProject>('projects', query);
    }

    toFirebase() {
        return {
            name: this.name
        };
    }
}

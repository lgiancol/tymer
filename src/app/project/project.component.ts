import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { IProject } from '../model/IProject';
import { Project } from '../model/project';

@Component({
    selector: 'tymer-project',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
    private collection!: AngularFirestoreCollection<IProject>;

    projects = new MatTableDataSource<IProject>();
    tableColumns = ['name'];
    newProjectControl = new FormControl('');

    constructor(
        private firestore: AngularFirestore
    ) { }

    ngOnInit(): void {
        this.collection = Project.Collection(this.firestore);
        this.collection.valueChanges({idField: 'id'}).subscribe(projects => {
            this.projects.data = projects;
        });
    }

    async onSubmitNewProject() {
        if(this.newProjectControl.value?.length! > 0) {
            const toAdd = new Project(this.newProjectControl.value!);
            await this.collection.add(toAdd.toFirebase());
            this.newProjectControl.setValue('');
        }
    }

}

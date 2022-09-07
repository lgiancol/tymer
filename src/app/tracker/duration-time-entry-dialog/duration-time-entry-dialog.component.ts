import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DisplayableEntry } from 'src/app/model/DisplayableEntry';
import { Project } from 'src/app/model/project';
import { TimeEntry } from 'src/app/model/time-entry';

@Component({
  selector: 'tymer-duration-time-entry-dialog',
  templateUrl: './duration-time-entry-dialog.component.html',
  styleUrls: ['./duration-time-entry-dialog.component.scss']
})
export class DurationTimeEntryDialogComponent implements OnInit {
    duration: number;
    projects: Project[];

    entry!: TimeEntry;

    constructor(
        public dialogRef: MatDialogRef<DurationTimeEntryDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { duration: number, projects: Project[] },
    ) {
        this.duration = data.duration;
        this.projects = data.projects;
    }

    ngOnInit(): void {
        this.entry = new TimeEntry(null, this.duration, '', new Date());
        if(this.projects.length == 1) {
            this.entry.project = this.projects[0].name;
        }
    }

}

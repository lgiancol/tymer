import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'tymer-notes-dialog',
    templateUrl: './notes-dialog.component.html',
    styleUrls: ['./notes-dialog.component.scss']
})
export class NotesDialogComponent {
    notes?: string = '';
    showMarkdown = false;

    constructor(
        public dialogRef: MatDialogRef<NotesDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { notes?: string },
    ) {
        this.notes = data.notes;
    }

}

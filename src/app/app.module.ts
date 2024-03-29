import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProjectComponent } from './project/project.component';

import { ClipboardModule } from '@angular/cdk/clipboard';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MarkdownPreviewComponent } from './components/markdown/markdown-preview/markdown-preview.component';
import { DebugPageComponent } from './debug-page/debug-page.component';
import { ExportedTimeSheetDialogComponent } from './dialogs/exported-time-sheet-dialog/exported-time-sheet-dialog.component';
import { RespectNewLinesPipe } from './pipes/respect-new-lines.pipe';
import { TotalHoursPipe } from './pipes/total-hours.pipe';
import { TymerPipe } from './pipes/tymer.pipe';
import { TimesheetComponent } from './timesheets/timesheet/timesheet.component';
import { TimesheetsComponent } from './timesheets/timesheets/timesheets.component';
import { DurationTimeEntryDialogComponent } from './tracker/duration-time-entry-dialog/duration-time-entry-dialog.component';
import { NotesDialogComponent } from './tracker/notes-dialog/notes-dialog.component';
import { TrackerComponent } from './tracker/tracker.component';



@NgModule({
    declarations: [
        AppComponent,
        DebugPageComponent,
        ProjectComponent,
        TrackerComponent,
        NotesDialogComponent,
        TymerPipe,
        DurationTimeEntryDialogComponent,
        TimesheetsComponent,
        TimesheetComponent,
        RespectNewLinesPipe,
        ExportedTimeSheetDialogComponent,
        MarkdownPreviewComponent,
        TotalHoursPipe,
    ],
    imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        // provideFirebaseApp(() => initializeApp(environment.firebase)),
        // provideFirestore(() => getFirestore()),
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        ClipboardModule,
        FormsModule,
        MatButtonModule,
        MatDatepickerModule,
        MatDialogModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatNativeDateModule,
        MatSelectModule,
        MatSidenavModule,
        MatTableModule,
        MatToolbarModule,
        MatTooltipModule,
        ReactiveFormsModule
    ],
    providers: [
        // {
        //     provide: USE_FIRESTORE_EMULATOR, useValue: !environment.production ? ['localhost', 8080] : undefined
        // }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

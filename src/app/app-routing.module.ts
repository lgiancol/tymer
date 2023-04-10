import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectComponent } from './project/project.component';
import { TimesheetComponent } from './timesheets/timesheet/timesheet.component';
import { TimesheetsComponent } from './timesheets/timesheets/timesheets.component';
import { TrackerComponent } from './tracker/tracker.component';
import { FixerComponent } from './fixer/fixer.component';

const routes: Routes = [
    {
        path: 'timesheets',
        children:[
            {
                path: '',
                component: TimesheetsComponent
            },
            {
                path: ':id',
                component: TimesheetComponent
            }
        ]
    },
    {
        path: 'tracker',
        component: TrackerComponent,
    },
    {
        path: 'projects',
        children: [
            {
                
                path: '',
                component: ProjectComponent,
            },
            {
                path: ':id',
                component: TrackerComponent
            }
        ]
    },
    {
        path: 'fixer',
        component: FixerComponent
    },
    {
        path: '**',
        redirectTo: ''
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

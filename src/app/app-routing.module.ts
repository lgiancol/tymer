import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectComponent } from './project/project.component';
import { TimesheetComponent } from './timesheets/timesheet/timesheet.component';
import { TimesheetsComponent } from './timesheets/timesheets/timesheets.component';
import { TrackerComponent } from './tracker/tracker.component';
import { DebugPageComponent } from './debug-page/debug-page.component';

const routes: Routes = [
  {
    path: '',
    component: DebugPageComponent,
  },
  {
    path: 'timesheets',
    children: [
      {
        path: '',
        component: TimesheetsComponent,
      },
      {
        path: ':id',
        component: TimesheetComponent,
      },
    ],
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
        component: TrackerComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

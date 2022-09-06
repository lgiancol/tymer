import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectComponent } from './project/project.component';
import { TrackerComponent } from './tracker/tracker.component';

const routes: Routes = [
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
        path: '**',
        redirectTo: ''
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

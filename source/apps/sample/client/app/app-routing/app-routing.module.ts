import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { SecondComponent } from '../second/second.component';

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
    }, {
        path: 'second',
        component: SecondComponent,
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ],
    declarations: []
})
export class AppRoutingModule { }
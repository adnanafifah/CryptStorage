import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { MaterialModule } from '../material.module';

const route: Routes = [
	{
		path: '',
		component: HomeComponent,
		pathMatch: 'full',
		canActivate: [AuthGuard],
		children: [
			{ path: '', loadChildren: '../dashboard/dashboard.module#DashboardModule' }
		]
	}
];

@NgModule({
	imports: [
		CommonModule,
		MaterialModule,
		RouterModule.forChild(route)
	],
	declarations: [HomeComponent]
})
export class HomeModule { }

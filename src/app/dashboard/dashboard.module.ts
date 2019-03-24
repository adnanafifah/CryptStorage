import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { DropZoneDirective } from '../directives/dropzone.directive';
import { FileSizePipe } from '../pipes/filesize.pipe';
import { ReactiveFormsModule } from '@angular/forms';

const route: Routes = [
	{ path: '', component: DashboardComponent, pathMatch: 'full' }
];

@NgModule({
	imports: [
		CommonModule,
		MaterialModule,
		ReactiveFormsModule,
		RouterModule.forChild(route)
	],
	declarations: [DashboardComponent, DropZoneDirective]
})
export class DashboardModule { }

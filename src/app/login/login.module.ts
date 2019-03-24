import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';
import { MaterialModule } from '../material.module';
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule } from '@angular/forms';

const route: Routes = [
	{ path: '', component: LoginComponent }
];

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(route),
		ReactiveFormsModule,
		MaterialModule
	],
	declarations: [LoginComponent, RegisterComponent]
})
export class LoginModule { }

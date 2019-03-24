import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
	{ path: '', loadChildren: './home/home.module#HomeModule', pathMatch: 'full', canActivate: [AuthGuard] },
	{ path: 'login', loadChildren: './login/login.module#LoginModule', canActivate: [LoginGuard] },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map, tap, take } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanActivate {
	constructor(
		private authServ: AuthService,
		private router: Router
	) { }
	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

		return this.authServ.user$.pipe(
			take(1),
			map(user => !!user),
			tap(loggedIn => {
				console.log(loggedIn);
				if (!loggedIn) {
					this.router.navigateByUrl('/login');
				}
			})
		);
	}
}

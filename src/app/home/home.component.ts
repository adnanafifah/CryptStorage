import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	user;

	constructor(
		private authService: AuthService,
		private router: Router
	) { }

	ngOnInit() {
		this.authService.user$.subscribe(userObj => {
			this.user = userObj;
		});
	}

	signOut() {
		this.authService.signOut().then(() => this.router.navigateByUrl('/login'));
	}


}

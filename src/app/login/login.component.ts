import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UiService } from '../services/ui.service';
import { MzModalComponent } from 'ngx-materialize';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	@ViewChild('signUpModal') signUpModal: MzModalComponent;
	loginForm: FormGroup;
	registerForm: FormGroup;

	loginSubmitted = false;
	registerSubmitted = false;

	loginLoader = false;
	registerLoader = false;

	constructor(
		private authServ: AuthService,
		private uiServ: UiService,
		private router: Router,
		private fb: FormBuilder
	) {
		// login form
		this.loginForm = this.fb.group({
			'email': [null, [Validators.required, Validators.email]],
			'password': [null, [Validators.required]]
		});

		// register form
		this.registerForm = this.fb.group({
			'email': [null, [Validators.required, Validators.email]],
			'firstname': [null, [Validators.required]],
			'lastname': [null, [Validators.required]],
			'password': [null, [Validators.required]],
			'confpassword': [null, [Validators.required]],
		}, { validator: this.passwordMatchValidator });
	}

	passwordMatchValidator(g: FormGroup) {
		return g.get('password').value === g.get('confpassword').value ? null : { 'mismatch': true };
	}

	ngOnInit() {
	}

	login() {
		this.loginSubmitted = true;
		if (this.loginForm.valid && !this.loginLoader) {
			this.loginLoader = true;
			this.authServ.signIn(this.loginForm.get('email').value, this.loginForm.get('password').value)
				.then(() => this.router.navigateByUrl('/'))
				.catch((e) => {
					this.loginLoader = false;
					this.uiServ.showToast(e, 'error');
				});
		} else {
			this.uiServ.showToast('Please fill in all required fields', 'error');
		}
	}

	register() {
		this.registerSubmitted = true;
		if (this.registerForm.valid && !this.registerLoader) {
			this.registerLoader = true;
			this.authServ.signUp(this.registerForm.value)
				.then(() => {
					this.signUpModal.closeModal();
					this.router.navigateByUrl('/');
				})
				.catch((e) => {
					this.registerLoader = false;
					this.uiServ.showToast(e, 'error');
				});
		} else {
			this.uiServ.showToast('Please fill in all required fields', 'error');
		}
	}

	async socialLogin(type) {
		try {
			if (type === 'google') {
				await this.authServ.googleSignIn();
			}

			this.router.navigateByUrl('/');
		} catch (e) {
			this.uiServ.showToast(e, 'error');
		}
	}

	getLoginErrorMsg(fieldName) {
		const field = this.loginForm.get(fieldName);

		if (field.hasError('required')) {
			return 'This field is required';
		} else if (field.hasError('email')) {
			return 'Please enter a valid email address';
		}

		return '';
	}

	getRegisterErrorMsg(fieldName) {
		const field = this.registerForm.get(fieldName);

		if (field.hasError('required')) {
			return 'This field is required';
		} else if (field.hasError('email')) {
			return 'Please enter a valid email address';
		} else if (fieldName === 'confpassword' && this.registerForm.hasError('mismatch')) {
			return 'Passwords do not match';
		}

		return '';
	}

	// Getters
	get email() {
		return this.loginForm.get('email');
	}
	get password() {
		return this.loginForm.get('password');
	}

	get regfirstname() {
		return this.registerForm.get('firstname');
	}
	get reglastname() {
		return this.registerForm.get('lastname');
	}
	get regemail() {
		return this.registerForm.get('email');
	}
	get regpassword() {
		return this.registerForm.get('password');
	}
	get regconfpassword() {
		return this.registerForm.get('confpassword');
	}

}

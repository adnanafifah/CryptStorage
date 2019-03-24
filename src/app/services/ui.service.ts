import { Injectable } from '@angular/core';
import { MzToastService } from 'ngx-materialize';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class UiService {
	loader = new BehaviorSubject(false);

	constructor(
		private toastService: MzToastService
	) { }

	showToast(message: any, type: 'success' | 'error' | 'info') {
		let color = 'green';
		let toastMsg = message;

		if (type === 'error') {
			color = 'red';
			if (message.code) {
				// toastMsg = FIREBASE_ERROR[message.code] ? FIREBASE_ERROR[message.code] : message;
			} else if (message.message) {
				toastMsg = message.message;
			}
		} else if (type === 'info') {
			color = 'cyan';
		}
		console.log(message);

		return this.toastService.show(toastMsg, 4000, color);
	}

	showLoader() {
		this.loader.next(true);
	}

	dismissLoader() {
		this.loader.next(false);
	}

	get isLoading() {
		return this.loader.pipe(take(1)).toPromise();
	}
}

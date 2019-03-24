import { Component, OnInit } from '@angular/core';
import { AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';
import { tap, switchMap, map, debounceTime, filter, startWith } from 'rxjs/operators';
import { User } from '../models/user.interface';
import { HttpClient, HttpRequest, HttpEventType } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import '../../3daes.js';
import { MzToastService } from 'ngx-materialize';
declare var AES: any;
@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

	// Main task
	task: AngularFireUploadTask;

	// Progress monitoring
	percentage: Observable<number>;
	percentageDownload = new BehaviorSubject<number>(0);

	snapshot: Observable<any>;

	// Download URL
	downloadURL: Observable<string>;

	// State for dropzone CSS toggling
	isHovering: boolean;

	currentUser: User;

	myFiles$: Observable<any>;

	searchForm: FormGroup;
	searchLoader = false;

	fileName;

	user;

	constructor(
		private storage: AngularFireStorage,
		private db: AngularFirestore,
		private authService: AuthService,
		private http: HttpClient,
		private fb: FormBuilder,
		private toastService: MzToastService
	) {
		this.searchForm = this.fb.group({
			'search': [null]
		});
	}

	ngOnInit() {
		this.authService.user$.subscribe(user => this.currentUser = user);

		this.myFiles$ = this.searchForm.get('search').valueChanges.pipe(
			startWith(null),
			map(searchvalue => searchvalue ? searchvalue.toLowerCase() : searchvalue),
			debounceTime(500),
			tap(() => this.searchLoader = true),
			switchMap(searchText => {
				return this.authService.user$.pipe(
					switchMap(user => {
						if (user) {
							return this.db.collection('files', ref => ref.where('userid', '==', user.uid)).snapshotChanges().pipe(
								map(actions => {
									return actions.map(a => {
										const data = a.payload.doc.data();
										const id = a.payload.doc.id;
										const type = a.payload.type;

										return { id, type, ...data };
									});
								})
							);
						} else {
							return of(null);
						}
					}),
					map(fileResult => {
						if (fileResult) {
							fileResult = fileResult.filter(file => (searchText && file.filename.toLowerCase().indexOf(searchText) !== -1) || !searchText);
						}

						return fileResult;
					})
				);
			}),
			tap(() => this.searchLoader = false)
		);

		this.authService.user$.subscribe(user => {
			this.user = user;
		});
	}


	toggleHover(event: boolean) {
		this.isHovering = event;
	}


	startUpload(event: any) {
		const reader = new FileReader();

		if (event.item(0).size < 10000000) {
			const self = this;
			reader.onloadend = function (e: any) {
				console.log(event.item(0));
				const encrypt = new AES();
				encrypt.tempCodeD = e.target.result;
				encrypt.tempKeyD = self.currentUser.uid;
				encrypt.inEnX();

				const path = `files/${new Date().getTime()}_${event.item(0).name}.encrypted`;

				const ref = self.storage.ref(path);

				// if file size more than 3mb
				if (event.item(0).size > 3000000) {
					self.task = ref.putString(encrypt.outputc);

					self.snapshot = self.task.snapshotChanges().pipe(
						tap(snap => {
							if (snap.bytesTransferred === snap.totalBytes) {

								// Update firestore on completion
								self.db.collection('files').add({ path, size: snap.totalBytes, userid: self.currentUser.uid, filename: event.item(0).name, timestamp: new Date() });
								self.db.doc(`users/${self.user.uid}`).update({
									totalused: self.user.totalused + snap.totalBytes
								});
								self.percentage = of(null);
							}
						})
					);
					self.percentage = self.task.percentageChanges();
				} else {
					ref.putString(encrypt.outputc).then(snap => {
						// Update firestore on completion
						self.db.collection('files').add({ path, size: snap.totalBytes, userid: self.currentUser.uid, filename: event.item(0).name, timestamp: new Date() });
						self.db.doc(`users/${self.user.uid}`).update({
							totalused: self.user.totalused + snap.totalBytes
						});
					});
				}

			};
		} else {
			this.toastService.show('Only a maximum of 10MB file size is allowed per upload!', 3000, 'red');
		}

		reader.readAsDataURL(event.item(0));
	}

	// Determines if the upload task is active
	isActive(snapshot) {
		return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
	}

	downloadFile(file) {
		const fileRef = this.storage.ref(file.path);

		fileRef.getDownloadURL().pipe(
			// switchMap(downloadUrl => this.http.get(downloadUrl, { responseType: 'blob' }))
			switchMap((downloadUrl: string) => {
				return this.http.request(new HttpRequest('GET', downloadUrl, { reportProgress: true, responseType: 'blob' }));
			})
		).subscribe(event => {

			// progress
			if (event.type === HttpEventType.DownloadProgress) {
				// event.loaded = bytes transfered
				// event.total = "Content-Length", set by the server

				const percentage = 100 / event.total * event.loaded;
				this.percentageDownload.next(percentage);
			}

			// finished
			if (event.type === HttpEventType.Response) {
				this.percentageDownload.next(0);
			}

		});
		// this.blobToDataText(res, e => {
		// 	const encrypt = new AES();
		// 	encrypt.tempCodeD = e;
		// 	encrypt.tempKeyD = this.currentUser.uid;
		// 	encrypt.inDeX();

		// 	console.log(encrypt.outputc);

		// 	const a = document.createElement('a');
		// 	document.body.appendChild(a);
		// 	a.href = encrypt.outputc;
		// 	a.download = file.filename;
		// 	a.click();
		// });
		// const a = document.createElement('a');
		// document.body.appendChild(a);
		// const url = window.URL.createObjectURL(res);
		// a.href = url;
		// a.download = file.filename;
		// a.click();
		// window.URL.revokeObjectURL(url);
		// })
	}

	hex2a(hexx) {
		const hex = hexx.toString();
		let str = '';
		for (let i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2) {
			str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
		}
		return str;
	}

	blobToDataText(blob, callback) {
		const a = new FileReader();
		a.onload = function (e: any) { callback(e.target.result); };
		a.readAsText(blob);
	}

	async deleteFile(file) {
		const fileRef = this.storage.ref(file.path);

		try {
			fileRef.delete();
			await this.db.doc(`files/${file.id}`).delete();
			this.db.doc(`users/${this.user.uid}`).update({
				totalused: this.user.totalused - file.size
			});
		} catch (e) {
			console.log(e);

		}
	}

}

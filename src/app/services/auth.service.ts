import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { User } from '../models/user.interface';
import { AngularFirestore } from '@angular/fire/firestore';
import { of, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	user$: Observable<User>;

	constructor(
		private afAuth: AngularFireAuth,
		private afs: AngularFirestore
	) {
		this.user$ = this.afAuth.authState.pipe(
			switchMap(user => {
				if (user) {
					return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
				} else {
					return of(null);
				}
			})
		);
	}

	signIn(email, password) {
		return this.afAuth.auth.signInWithEmailAndPassword(email, password);
	}

	signUp(userObj) {
		return this.afAuth.auth.createUserWithEmailAndPassword(userObj.email, userObj.password)
			.then(res => {
				return this.afs.collection('users').doc(res.user.uid).set({
					email: userObj.email,
					firstname: userObj.firstname,
					lastname: userObj.lastname,
					uid: res.user.uid,
					totalused: 0
				}, { merge: true });
			});
	}

	async googleSignIn() {
		const provider = new firebase.auth.GoogleAuthProvider();
		const userMetaData = await this.afAuth.auth.signInWithPopup(provider);
		const userObj: User = {
			uid: userMetaData.user.uid,
			email: userMetaData.user.email,
			firstname: userMetaData.additionalUserInfo.profile['given_name'],
			lastname: userMetaData.additionalUserInfo.profile['family_name'],
			phoneno: userMetaData.user.phoneNumber,
			image: userMetaData.user.photoURL,
			totalused: 0
		};

		return this.afs.doc(`users/${userObj.uid}`).set(userObj, { merge: true });
	}

	signOut() {
		return this.afAuth.auth.signOut();
	}
}

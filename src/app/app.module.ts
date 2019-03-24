import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';

// Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { environment } from 'src/environments/environment';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';

// Services
import { AuthService } from './services/auth.service';
import { UiService } from './services/ui.service';

@NgModule({
	declarations: [
		AppComponent,
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		AngularFireModule.initializeApp(environment.firebase),
		AngularFirestoreModule,
		AngularFireStorageModule,
		AngularFireAuthModule,
		MaterialModule,
		AppRoutingModule
	],
	providers: [
		AuthService,
		UiService,
		AuthGuard,
		LoginGuard,
		HttpClient
	],
	bootstrap: [AppComponent]
})
export class AppModule { }

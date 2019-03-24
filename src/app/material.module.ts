import {
	MzInputModule,
	MzIconModule,
	MzIconMdiModule,
	MzButtonModule,
	MzSidenavModule,
	MzNavbarModule,
	MzDropdownModule,
	MzProgressModule,
	MzModalModule,
	MzToastModule
} from 'ngx-materialize';
import { NgModule } from '@angular/core';
import { FileSizePipe } from './pipes/filesize.pipe';

@NgModule({
	imports: [
		MzInputModule,
		MzIconModule,
		MzIconMdiModule,
		MzButtonModule,
		MzSidenavModule,
		MzNavbarModule,
		MzDropdownModule,
		MzProgressModule,
		MzModalModule,
		MzToastModule
	],
	exports: [
		MzInputModule,
		MzIconModule,
		MzIconMdiModule,
		MzButtonModule,
		MzSidenavModule,
		MzNavbarModule,
		MzDropdownModule,
		MzProgressModule,
		MzModalModule,
		MzToastModule,
		FileSizePipe
	],
	declarations: [FileSizePipe]
})
export class MaterialModule { }

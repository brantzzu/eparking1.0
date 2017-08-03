import {NgModule} from '@angular/core';
import {IonicModule} from 'ionic-angular';
import {PaginationPage} from "./pagination-component/pagination";
import {SelectPic} from "./pic-viewer-component/select-pic";
import {ViewerPicModule} from "./pic-viewer-component/viewer-pic.module";

@NgModule({
  imports: [IonicModule, ViewerPicModule],
  declarations: [PaginationPage, SelectPic],
  exports: [PaginationPage, SelectPic],
  providers: []
})
export class SharedModule {
}

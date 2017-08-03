import {NgModule} from '@angular/core';
import {IonicModule} from 'ionic-angular';
import {TestPage} from "./test";
import {TestService} from "./TestService";
import {SelectPicturePageModule} from "../../shared/select-picture/select-picture.module";
@NgModule({
  imports: [
    IonicModule,
    SelectPicturePageModule
  ],
  declarations: [TestPage],
  entryComponents: [TestPage],
  providers: [TestService]
})
export class TestModule {
}

import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { IndexPage } from "./index";
import { TestService } from "./TestService";
import { SelectPicturePageModule } from "../../shared/select-picture/select-picture.module";
@NgModule({
  imports: [
    IonicModule,
    SelectPicturePageModule
  ],
  declarations: [IndexPage],
  entryComponents: [IndexPage],
  providers: [TestService]
})
export class IndexModule {
}

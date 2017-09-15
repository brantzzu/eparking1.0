import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { FirstPage } from "./first";
import { TestService } from "./TestService";
import { SelectPicturePageModule } from "../../shared/select-picture/select-picture.module";
@NgModule({
  imports: [
    IonicModule,
    SelectPicturePageModule
  ],
  declarations: [FirstPage],
  entryComponents: [FirstPage],
  providers: [TestService]
})
export class FirstModule {
}

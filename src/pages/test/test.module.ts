import {NgModule} from '@angular/core';
import {IonicModule} from 'ionic-angular';
import {TestPage} from "./test";
import {TestService} from "./TestService";
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  imports: [
    IonicModule,
    SharedModule
  ],
  declarations: [TestPage],
  entryComponents: [TestPage],
  providers: [TestService]
})
export class TestModule {
}

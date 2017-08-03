import {NgModule} from '@angular/core';
import {IonicModule} from 'ionic-angular';
import {TabsPage} from "./tabs";

@NgModule({
  imports: [IonicModule],
  declarations: [TabsPage],
  entryComponents: [TabsPage],
  providers: [],
  exports: [IonicModule]
})
export class TabModule {
}

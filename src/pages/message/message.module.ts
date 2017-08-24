import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { MessagePage } from "./message";


@NgModule({
    imports: [
        IonicModule
    ],
    declarations: [MessagePage],
    entryComponents: [MessagePage],
    providers: [],
    exports: [IonicModule]
})
export class MessageModule {
}
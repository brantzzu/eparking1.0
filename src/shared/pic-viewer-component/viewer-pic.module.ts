import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewerPic } from './viewer-pic';

@NgModule({
  declarations: [
    ViewerPic,
  ],
  imports: [
    IonicPageModule.forChild(ViewerPic),
  ],
  exports: [
    ViewerPic
  ]
})
export class ViewerPicModule {}

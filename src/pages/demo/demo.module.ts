import {NgModule} from '@angular/core';
import {IonicModule} from 'ionic-angular';
import {DemoPage} from "./demo";
import {PaginationDemoPage} from "./pagination-demo/pagination-demo";
import {CustomIconDemoPage} from "./custom-icon-demo/custom-icon-demo";
import {ChartjsDemoPage} from "./chartjs-demo/chartjs-demo";
import {SelectPicDemoPage} from "./select-pic-demo/select-pic-demo";
import {CustomPipeDemo} from "./custom-pipe-demo/custom-pipe-demo";
import {Conversion} from "../../pipes/conversion";
import {PagingPageModule} from "../../shared/paging/paging.module";
import {SelectPicturePageModule} from "../../shared/select-picture/select-picture.module";
import {ModalScalePageModule} from "./transition-demo/modal-scale/modal-scale.module";
import {ModalFromRightPageModule} from "./transition-demo/modal-from-right/modal-from-right.module";
import {TransitionDemoPageModule} from "./transition-demo/transition-demo.module";
import {CropPicDemoPage} from "./crop-pic-demo/crop-pic-demo";

@NgModule({
  imports: [IonicModule, PagingPageModule,SelectPicturePageModule,TransitionDemoPageModule, ModalScalePageModule,ModalFromRightPageModule],
  declarations: [DemoPage, PaginationDemoPage, CustomIconDemoPage, ChartjsDemoPage, SelectPicDemoPage,CustomPipeDemo,Conversion,CropPicDemoPage],
  entryComponents: [DemoPage, PaginationDemoPage, CustomIconDemoPage, ChartjsDemoPage, SelectPicDemoPage,CustomPipeDemo,CropPicDemoPage],
  providers: [],
  exports: [IonicModule]
})
export class DemoModule {
}

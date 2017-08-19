import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { MinePage } from './mine';
import { MineEditPage } from './mine-edit/mine-edit';
import { ParkingRecordPage } from './mine-parking-record/mine-parking-record';
import { ManageCarPage } from './manage-car/manage-car';
import { MineEditModalPage } from './mine-edit-modal/mine-edit-modal';
import { MineEditAvatarModalPage } from './mine-edit-avatar-modal/mine-edit-avatar-modal';
import { FeedBackPage } from "./feed-back/feed-back";
import { AboutPage } from "./about/about";
import { UpdateLogPage } from "./update-log/update-log";
import { ShowPicturesPage } from "./show-pictures/show-pictures";
import { SelectPicturePageModule } from "../../shared/select-picture/select-picture.module";
import { MineService } from "./MineService";
import { WorkMapPage } from "./work-map/work-map";
import { MapLocationModule } from "../../shared/map-component/map-location/map-location.module";
import { SettingPage } from "./setting/setting";
import { ChangePasswordPage } from "./change-password/change-password";


@NgModule({
  imports: [IonicModule, SelectPicturePageModule, MapLocationModule],
  declarations: [MinePage, MineEditPage, ParkingRecordPage, ManageCarPage, MineEditModalPage, MineEditAvatarModalPage, FeedBackPage, AboutPage, UpdateLogPage, ShowPicturesPage, WorkMapPage, SettingPage, ChangePasswordPage,],
  entryComponents: [MinePage, MineEditPage, ParkingRecordPage, ManageCarPage, MineEditModalPage, MineEditAvatarModalPage, FeedBackPage, AboutPage, UpdateLogPage, ShowPicturesPage, WorkMapPage, SettingPage, ChangePasswordPage],
  providers: [MineService],
  exports: [IonicModule]
})
export class MineModule {
}
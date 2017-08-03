import {NgModule} from '@angular/core';
import {IonicModule} from 'ionic-angular';
import {MinePage} from './mine';
import {MineEditPage} from './mine-edit/mine-edit';
import {MineEditModalPage} from './mine-edit-modal/mine-edit-modal';
import {MineEditAvatarModalPage} from './mine-edit-avatar-modal/mine-edit-avatar-modal';
import {FeedBackPage} from "./feed-back/feed-back";
import {AboutPage} from "./about/about";
import {UpdateLogPage} from "./update-log/update-log";
import {ShowPicturesPage} from "./show-pictures/show-pictures";
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  imports: [IonicModule, SharedModule],
  declarations: [MinePage, MineEditPage, MineEditModalPage, MineEditAvatarModalPage, FeedBackPage, AboutPage, UpdateLogPage, ShowPicturesPage],
  entryComponents: [MinePage, MineEditPage, MineEditModalPage, MineEditAvatarModalPage, FeedBackPage, AboutPage, UpdateLogPage, ShowPicturesPage],
  providers: [],
  exports: [IonicModule]
})
export class MineModule {
}

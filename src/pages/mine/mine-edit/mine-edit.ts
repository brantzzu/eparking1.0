import {Component} from '@angular/core';
import {ModalController, NavParams} from 'ionic-angular';
import {MineEditModalPage} from '../mine-edit-modal/mine-edit-modal';
import {MineEditAvatarModalPage} from '../mine-edit-avatar-modal/mine-edit-avatar-modal';
import {UserInfo} from "../../../model/UserInfo";
import {Helper} from "../../../providers/Helper";

@Component({
  selector: 'page-mine-edit',
  templateUrl: 'mine-edit.html'
})
export class MineEditPage {
  userInfo: UserInfo;
  avatarPath: string;


  constructor(private modalCtrl: ModalController,
              private params: NavParams,
              private helper: Helper) {
    this.avatarPath = params.get('avatarPath');
    this.userInfo = params.get('userInfo');
  }

  viewAvatar($event) {
    $event.stopPropagation();
    let modal = this.modalCtrl.create(MineEditAvatarModalPage, {avatarPath: this.avatarPath});
    modal.present();
    modal.onDidDismiss(data => {
      data && (this.avatarPath = data.avatarPath)
    });
  }

  openModal() {
    let modal = this.modalCtrl.create(MineEditModalPage, {'userInfo':this.userInfo});
    modal.present();
    modal.onDidDismiss(userInfo => {
      userInfo && (this.userInfo = userInfo)
    });
  }

}

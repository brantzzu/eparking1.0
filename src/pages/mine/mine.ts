import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Platform, NavController, ModalController, AlertController } from 'ionic-angular';
import { MineEditPage } from './mine-edit/mine-edit';
import { MineEditAvatarModalPage } from './mine-edit-avatar-modal/mine-edit-avatar-modal';
import { ParkingRecordPage } from './mine-parking-record/mine-parking-record';
import { UserInfo } from "../../model/UserInfo";
import { AboutPage } from "./about/about";
import { LoginPage } from "../login/login";
import { Helper } from "../../providers/Helper";
import { DEFAULT_AVATAR } from "../../providers/Constants";
import { WorkMapPage } from "./work-map/work-map";
import { SettingPage } from "./setting/setting";
import { ChangePasswordPage } from "./change-password/change-password";

@Component({
  selector: 'page-mine',
  templateUrl: 'mine.html'
})
export class MinePage {
  userInfo: UserInfo;
  avatarPath: String = DEFAULT_AVATAR;

  constructor(private navCtrl: NavController,
    private platform: Platform,
    private storage: Storage,
    private helper: Helper,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController) {

  }

  ionViewWillEnter() {
    this.storage.get('LoginInfo').then(loginInfo => {
      let userInfo = loginInfo.user;
      if (userInfo) {
        this.userInfo = userInfo;
        this.avatarPath = userInfo.avatarPath;
      }
    });
  }

  edit() {
    this.navCtrl.push(MineEditPage, { 'userInfo': this.userInfo, 'avatarPath': this.avatarPath });
  }

  viewParkingRecord() {
    this.navCtrl.push(ParkingRecordPage, { 'userInfo': this.userInfo });
  }

  setting() {
    this.navCtrl.push(SettingPage);
  }

  loginOut() {
    this.alertCtrl.create({
      title: '确认重新登录？',
      buttons: [{ text: '取消' },
      {
        text: '确定',
        handler: () => {
          let modal = this.modalCtrl.create(LoginPage);
          modal.present();
          modal.onDidDismiss(userInfo => {
            if (userInfo) {
              this.userInfo = userInfo;
              this.helper.loadAvatarPath(userInfo.avatarId).subscribe(avatarPath => {//获取头像路径
                this.avatarPath = avatarPath
              });
            }
          });
        }
      }
      ]
    }).present();
  }

  map() {
    this.navCtrl.push(WorkMapPage);
  }

  changePassword() {
    let modal = this.modalCtrl.create(ChangePasswordPage);
    modal.present();
    modal.onDidDismiss(data => {
    });
  }

  exitSoftware() {
    this.alertCtrl.create({
      title: '确认退出软件？',
      buttons: [{ text: '取消' },
      {
        text: '确定',
        handler: () => {
          this.storage.clear();
          this.platform.exitApp();
        }
      }
      ]
    }).present();
  }

  about() {
    this.navCtrl.push(AboutPage);
  }

  viewAvatar($event) {
    $event.stopPropagation();
    let modal = this.modalCtrl.create(MineEditAvatarModalPage, { avatarPath: this.avatarPath });
    modal.present();
    modal.onDidDismiss(data => {
      data && (this.avatarPath = data.avatarPath)
    });
  }

}

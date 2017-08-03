import {Component} from '@angular/core';
import {Storage} from '@ionic/storage';

import {Platform, NavController, ModalController, AlertController} from 'ionic-angular';
import {MineEditPage} from './mine-edit/mine-edit';
import {MineEditAvatarModalPage} from './mine-edit-avatar-modal/mine-edit-avatar-modal';
import {UserInfo} from "../../model/UserInfo";
import {DEFAULT_AVATAR} from "../../providers/Constants";
import {AboutPage} from "./about/about";
import {LoginPage} from "../login/login";

@Component({
  selector: 'page-mine',
  templateUrl: 'mine.html'
})
export class MinePage {
  userInfo: UserInfo;
  avatarPath: string = DEFAULT_AVATAR;

  constructor(private navCtrl: NavController,
              private platform: Platform,
              private storage: Storage,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController) {
    this.storage.get('UserInfo').then((userInfo: UserInfo) => {
      if (userInfo) {
        this.userInfo = userInfo;
        userInfo.avatar && (this.avatarPath = userInfo.avatar);
      }
    });
  }


  edit() {
    this.navCtrl.push(MineEditPage, {'userInfo': this.userInfo, 'avatarPath': this.avatarPath});
  }

  viewAvatar($event) {
    $event.stopPropagation();
    let modal = this.modalCtrl.create(MineEditAvatarModalPage, {
      'userInfo': this.userInfo,
      'avatarPath': this.avatarPath
    });
    modal.present();
    modal.onDidDismiss(data => {
      data && (this.avatarPath = data.avatarPath)
    });
  }


  loginOut() {
    this.alertCtrl.create({
      title: '确认重新登录？',
      buttons: [{text: '取消'},
        {
          text: '确定',
          handler: () => {
            let modal = this.modalCtrl.create(LoginPage);
            modal.present();
            modal.onDidDismiss(userInfo => {
              if (userInfo) {
                this.userInfo = userInfo;
                userInfo.avatar && (this.avatarPath = userInfo.avatar);
              }
            });
          }
        }
      ]
    }).present();
  }

  exitSoftware() {
    this.alertCtrl.create({
      title: '确认退出软件？',
      buttons: [{text: '取消'},
        {
          text: '确定',
          handler: () => {
            this.platform.exitApp();
          }
        }
      ]
    }).present();
  }

  about() {
    this.navCtrl.push(AboutPage);
  }
}

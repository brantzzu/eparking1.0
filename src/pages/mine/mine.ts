import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { CallNumber } from '@ionic-native/call-number';
import { Platform, NavController, ModalController, AlertController } from 'ionic-angular';
import { MineEditPage } from './mine-edit/mine-edit';
import { MineEditAvatarModalPage } from './mine-edit-avatar-modal/mine-edit-avatar-modal';
import { ParkingRecordPage } from './mine-parking-record/mine-parking-record';
import { ManageCarPage } from './manage-car/manage-car';
import { UserInfo } from "../../model/UserInfo";
import { AboutPage } from "./about/about";
import { AlipayDemoPage } from '../demo/alipay/alipay-demo'
import { LoginPage } from "../login/login";
import { Helper } from "../../providers/Helper";
import { DEFAULT_AVATAR } from "../../providers/Constants";
import { WorkMapPage } from "./work-map/work-map";
import { SettingPage } from "./setting/setting";
import { ChangePasswordPage } from "./change-password/change-password";
import { AppAvailability } from '@ionic-native/app-availability';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { NativeService } from "../../providers/NativeService";
declare var startApp: any;

@Component({
  selector: 'page-mine',
  templateUrl: 'mine.html'
})
export class MinePage {
  userInfo: UserInfo;
  avatarPath: String = DEFAULT_AVATAR;

  constructor(private navCtrl: NavController,
    private platform: Platform,
    private nativeService: NativeService,
    private appAvailability: AppAvailability,
    private iab: InAppBrowser,
    private storage: Storage,
    private helper: Helper,
    private modalCtrl: ModalController,
    private CallNumber: CallNumber,
    private alertCtrl: AlertController) {

  }

  ionViewWillEnter() {
    this.storage.get('LoginInfo').then(loginInfo => {
      let userInfo = loginInfo.user;
      if (userInfo) {
        console.log("userInfoionviewwillEnter:");
        console.log(userInfo);
      }
    });
  }

  ngAfterContentInit() {
    this.storage.get('LoginInfo').then(loginInfo => {
      //let userInfo = loginInfo.user;
      this.userInfo = loginInfo.user;
      this.avatarPath = loginInfo.user.avatarPath;
    });
  }

  edit() {
    this.navCtrl.push(MineEditPage, { 'userInfo': this.userInfo, 'avatarPath': this.avatarPath });
  }
  /**
   * 停车记录
   */
  viewParkingRecord() {
    this.navCtrl.push(ParkingRecordPage, { 'userInfo': this.userInfo });
  }

  /**
   * 车辆管理
   */
  manageCar() {
    this.navCtrl.push(ManageCarPage, { 'userInfo': this.userInfo });
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

  zhifu() {
    this.navCtrl.push(AlipayDemoPage);
  }

  viewAvatar($event) {
    $event.stopPropagation();
    let modal = this.modalCtrl.create(MineEditAvatarModalPage, { avatarPath: this.avatarPath });
    modal.present();
    modal.onDidDismiss(data => {
      data && (this.avatarPath = data.avatarPath)
    });
  }
  /**
   * 拨打电话
   */
  callConfirm(number) {
    let confirm = this.alertCtrl.create({
      title: '拨打VIP服务电话',
      message: '您确定需要拨打' + number + '吗？',
      buttons: [
        {
          text: '取消',
          handler: () => {
          }
        },
        {
          text: '确定',
          handler: () => {
            this.call(number);
          }
        }
      ]
    });
    confirm.present();
  }

  call(number) {
    this.CallNumber.callNumber(number, true)
      .then(() => console.log('Launched dialer!'))
      .catch(() => console.log('Error launching dialer'));
  }
  openAlipay() {
    this.launchExternalApp('alipay://', 'com.eg.android.AlipayGphone', 'alipay://platformapi/startapp?appId=20000056', 'https://www.alipay.com/');
  }

  launchExternalApp(iosSchemaName: string, androidPackageName: string, appUrl: string, httpUrl: string) {
    let app: string;
    if (this.nativeService.isIos()) {
      app = iosSchemaName;
    } else if (this.nativeService.isAndroid()) {
      app = androidPackageName;
    } else {
      const browser = this.iab.create(httpUrl, '_system'); //new InAppBrowser(httpUrl, '_system');
      return;
    }

    this.appAvailability.check(app).then(
      () => { // success callback
        console.log(app + ":is available ...");
        if (this.nativeService.isIos()) {
          window.open(appUrl);
        } else {
          let sApp = startApp.set({ /* params */
            "action": "ACTION_VIEW",
            "category": "CATEGORY_DEFAULT",
            "type": "text/css",
            "package": app,
            "uri": appUrl,
            "flags": ["FLAG_ACTIVITY_CLEAR_TOP", "FLAG_ACTIVITY_CLEAR_TASK"],
            "intentstart": "startActivity",
          }, { /* extras */
              "EXTRA_STREAM": "extraValue1",
              "extraKey2": "extraValue2"
            });
          sApp.start(() => { /* success */
            console.log("app start success...");//alert("OK");
          }, (error) => { /* fail */
            console.log("app start failure...");//alert(error);
          });
          //const browser = this.iab.create(appUrl, '_system');
        }
      },
      () => { // error callback
        console.log(app + ":is not available...");
        const browser = this.iab.create(httpUrl, '_system');
      }
    );
  }

}

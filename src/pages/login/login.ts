import { Component } from '@angular/core';
import { ModalController, ViewController, Platform, AlertController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FormBuilder, Validators } from '@angular/forms';

import { LoginService } from './LoginService';

import { FindPasswordPage } from './find-password/find-password';
import { RegisterPage } from './register/register';
import { UserInfo, LoginInfo } from "../../model/UserInfo";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [LoginService]
})
export class LoginPage {
  userInfo: UserInfo;
  submitted: boolean = false;
  canLeave: boolean = false;
  loginForm: any;

  constructor(private viewCtrl: ViewController,
    private formBuilder: FormBuilder,
    private storage: Storage,
    private modalCtrl: ModalController,
    private platform: Platform,
    private alertCtrl: AlertController,
    private events: Events,
    private loginService: LoginService) {
    this.loginForm = this.formBuilder.group({
      username: ['13638010000', [Validators.required, Validators.minLength(4)]],// 第一个参数是默认值
      password: ['123456', [Validators.required, Validators.minLength(4)]]
    });
  }

  ionViewWillEnter() {
    this.storage.get('LoginInfo').then((loginInfo: LoginInfo) => {
      this.userInfo = loginInfo && loginInfo.user ? loginInfo.user : null;
    });
  }

  ionViewCanLeave(): boolean {
    let bool = !!this.userInfo;
    if (this.canLeave || bool) {
      return true;
    } else {
      this.alertCtrl.create({
        title: '确认退出软件？',
        buttons: [{ text: '取消' },
        {
          text: '确定',
          handler: () => {
            this.platform.exitApp();
          }
        }
        ]
      }).present();
      return false;
    }
  }

  login(user) {
    this.submitted = true;
    this.loginService.login(user)
      .subscribe(loginInfo => {
        this.submitted = false;
        this.userInfo = loginInfo.user;
        this.events.publish('user:login', loginInfo);
        this.viewCtrl.dismiss(loginInfo.user);
      }, err => {
        this.submitted = false;
      });
  }


  toRegister() {
    this.canLeave = true;
    let modal = this.modalCtrl.create(RegisterPage);
    modal.present();
    this.canLeave = false;
  }

  findPassword() {
    this.canLeave = true;
    let modal = this.modalCtrl.create(FindPasswordPage);
    modal.present();
    this.canLeave = false
  }

}
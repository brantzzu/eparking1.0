import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginPage } from '../login';
import { HttpService } from "../../../providers/HttpService";
//import { Response } from "@angular/http";
import { NativeService } from "../../../providers/NativeService";
import { Http, Headers, RequestOptions } from '@angular/http';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  registerForm: any;
  httpResponseData: any;
  randVerifyCode: String;
  disabled: boolean = false;

  constructor(private navCtrl: NavController,
    private viewCtrl: ViewController,
    private httpService: HttpService,
    private nativeService: NativeService,
    private http: Http,
    private formBuilder: FormBuilder) {
    //this.disabled = false;
    this.registerForm = this.formBuilder.group({
      username: [, [Validators.required, Validators.pattern('[(\u4e00-\u9fa5)0-9a-zA-Z\_\s@]+')]],
      verificationCode: [, [Validators.required, Validators.minLength(4), Validators.pattern('[0-9]{4}')]],
      phone: [, [Validators.required, Validators.pattern('1[0-9]{10}')]],
      password: [, [Validators.required]]
    })
  };

  confirm() {
    // console.log("formValue:");
    // console.log(this.registerForm.value['password']);
    // console.log(this.registerForm.value.password);
    if (this.registerForm.value.verificationCode != this.randVerifyCode) {
      this.nativeService.showToast("验证码不正确");
    } else {
      let param = {
        'username': this.registerForm.value.username,
        'phone': this.registerForm.value.phone,
        'password': this.registerForm.value.password
      };

      this.httpService.post('http://quants.sufe.edu.cn/register', param).subscribe(data => {
        // console.log("data body:" + data['_body']);
        this.httpResponseData = data['_body'];
        if (this.httpResponseData == "registeredSuccess") {
          this.nativeService.showToast('注册成功！');
          this.navCtrl.setRoot(LoginPage);
        } else if (this.httpResponseData == "userExists") {
          this.nativeService.showToast('该手机号已经注册');
        } else {
          this.nativeService.showToast('注册中...');
        }
      }, error => {
        console.log(error);// Error getting the data
        this.nativeService.showToast('注册失败，请重新注册！');
      });

    }


  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  /**
   * 获取手机验证码
   */
  getVerificationCode() {
    let times = 60;
    let timer = null;
    this.disabled = true;
    timer = setInterval(() => {
      times--;
      document.getElementById("verification").innerText = times + "秒后重试";
      if (times <= 0) {
        this.disabled = false;
        document.getElementById("verification").innerText = "发送验证码";
        clearInterval(timer);
        times = 60;
      }
      //console.log(times);
    }, 1000);

    this.randVerifyCode = Math.floor(Math.random() * 10).toString() + Math.floor(Math.random() * 10).toString() + Math.floor(Math.random() * 10).toString() + Math.floor(Math.random() * 10).toString();
    let params = {
      'apikey': '7afbc12e5639cc5457d200650f3c3cb9',
      'mobile': this.registerForm.value.phone,
      'text': '【倚泊智能】您的验证码是' + this.randVerifyCode + '。如非本人操作，请忽略本短信'
    };
    let url = 'https://sms.yunpian.com/v2/sms/single_send.json';
    this.httpService.postVerfiedCode(url, params).subscribe(res => {
      console.log("res:");
      console.log(res['_body']);
      this.nativeService.showToast("验证码发送成功");
    }, err => {
      if (err['_body'].code == '22') {
        this.nativeService.showToast("一小时内只能发送3次验证码,请稍候再试");
      } else {
        this.nativeService.showToast("验证码发送错误，请稍候再试");
      }
    });
  }

}

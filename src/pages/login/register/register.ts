import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginPage } from '../login';
import { HttpService } from "../../../providers/HttpService";
import { Response } from "@angular/http";
import { NativeService } from "../../../providers/NativeService";

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  registerForm: any;
  httpResponseData: any;

  constructor(private navCtrl: NavController,
    private viewCtrl: ViewController,
    private httpService: HttpService,
    private nativeService: NativeService,
    private formBuilder: FormBuilder) {
    this.registerForm = this.formBuilder.group({
      username: [, [Validators.required, Validators.pattern('[(\u4e00-\u9fa5)0-9a-zA-Z\_\s@]+')]],
      verificationCode: [, [Validators.required, Validators.minLength(4), Validators.pattern('1[0-9]{3}')]],
      phone: [, [Validators.required, Validators.pattern('1[0-9]{10}')]],
      password: [, [Validators.required]]
    })
  };

  confirm() {
    // console.log("formValue:");
    // console.log(this.registerForm.value['password']);
    // console.log(this.registerForm.value.password);
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

  dismiss() {
    this.viewCtrl.dismiss();
  }

}

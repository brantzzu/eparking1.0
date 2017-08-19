import { Component } from '@angular/core';
import { ModalController, ViewController, NavParams } from 'ionic-angular';
import { UserInfo } from "../../../model/UserInfo";
import { Helper } from "../../../providers/Helper";
import { HttpService } from "../../../providers/HttpService";
import { NativeService } from "../../../providers/NativeService";
import { FormBuilder, Validators } from '@angular/forms';
import { Response } from "@angular/http";

@Component({
    selector: 'page-manage-car',
    templateUrl: 'manage-car.html'
})
export class ManageCarPage {
    userInfo: UserInfo;
    data: any;
    threeCarsBind: boolean = false;
    bindCarForm: any;
    submitted: boolean = false;
    httpResponseData: any;
    bindCars: any;
    leftBindCars: any;

    constructor(private modalCtrl: ModalController,
        private viewCtrl: ViewController,
        private params: NavParams,
        private formBuilder: FormBuilder,
        private httpService: HttpService,
        private nativeService: NativeService,
        private helper: Helper) {
        this.userInfo = params.get('userInfo');
        this.bindCarForm = this.formBuilder.group({
            c1: ['沪', [Validators.required, Validators.pattern('[\u4e00-\u9fa5]')]],
            c2: ['A', [Validators.required, Validators.pattern('[A-Z0-9]')]],
            c3: ['Z', [Validators.required, Validators.pattern('[A-Z0-9]')]],
            c4: ['0', [Validators.required, Validators.pattern('[A-Z0-9]')]],
            c5: ['0', [Validators.required, Validators.pattern('[A-Z0-9]')]],
            c6: ['0', [Validators.required, Validators.pattern('[A-Z0-9]')]],
            c7: ['1', [Validators.required, Validators.pattern('[A-Z0-9]')]]
        });
    }
    ionViewWillEnter() {
        if (this.userInfo) {
            this.httpService.get("http://quants.sufe.edu.cn/bindCars", { phone: this.userInfo.phone }).map(res => {
                return res.json();
            }).subscribe((json: any) => {
                this.leftBindCars = Math.abs(3 - json.length); //一个手机号最多绑定3个车牌号;
                this.bindCars = json;
                if (json.length >= 3) {
                    this.threeCarsBind = true;

                }
            });

        } else {
            this.nativeService.showToast('获取用户信息失败，请重新登录！');
        }

    }
    ngAfterViewInit() {

    }

    removeItem(item) {
        for (let i = 0; i < this.bindCars.length; i++) {
            if (this.bindCars[i]['carNo'] == item) {
                this.httpService.post('http://quants.sufe.edu.cn/updateBindCars', { 'carNo': item }).subscribe(result => {
                    if (result['_body'] == 'deletedSuccess') {
                        this.nativeService.showToast("删除成功！");
                        this.bindCars.splice(i, 1);

                    } else {
                        this.nativeService.showToast("删除失败！");
                    }
                }, error => {
                    console.log(error);
                    this.nativeService.showToast("删除失败！");

                })

            }

        }

        // console.log("bindCars:");
        // console.log(this.bindCars[0]['carNo']);
    }

    bindCar(carNo) {
        let param = {
            'c1': carNo.c1,
            'c2': carNo.c2,
            'c3': carNo.c3,
            'c4': carNo.c4,
            'c5': carNo.c5,
            'c6': carNo.c6,
            'c7': carNo.c7,
            'phone': this.userInfo.phone
        };
        let url = 'http://quants.sufe.edu.cn/bindCar';
        this.submitted = true;
        this.httpService.post(url, param).subscribe(result => {
            this.httpResponseData = result['_body'];
            console.log("result:" + this.httpResponseData);
            if (this.httpResponseData == "bindSuccess") {
                this.nativeService.showToast('绑定车牌号成功!');
                this.viewCtrl.dismiss();
            } else if (this.httpResponseData == "alreadyBind") {
                this.submitted = false;
                this.nativeService.showToast("该车牌号已经绑定！")
            } else if (this.httpResponseData == "moreThan3Cars") {
                this.submitted = false;
                this.nativeService.showToast("您已绑定了3台车！");
            } else {
                this.submitted = false;
                this.nativeService.showToast("绑定失败！");
            }

        }, error => {
            console.log(error);
            this.nativeService.showToast("绑定失败！");
            this.submitted = false;
        });

    }

}
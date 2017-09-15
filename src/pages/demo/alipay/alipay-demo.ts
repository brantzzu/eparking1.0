import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
//import Chart from 'chart.js';
import { Alipay, AlipayOrder } from '@ionic-native/alipay';
import { HttpService } from "../../../providers/HttpService";
import { NativeService } from "../../../providers/NativeService";
/*
  Generated class for the ChartjsDemo page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
//declare var AliPay: any;
@Component({
    selector: 'alipay-demo',
    templateUrl: 'alipay-demo.html'
})
export class AlipayDemoPage {
    payInfo: AlipayOrder;
    payResult: any;
    httpResponseData: any;

    constructor(public navCtrl: NavController, public navParams: NavParams,
        private httpService: HttpService, private nativeService: NativeService,
        private alipay: Alipay) { }




    ionViewDidEnter() {

    }

    alipayTest() {
        //payInfo: AlipayOrder; // 从服务器端返回。
        // this.payInfo = {
        //     tradeNo: new Date().getTime(),
        //     subject: "测试标题",
        //     body: "我的两分钱啊",
        //     price: 0.02,
        //     notifyUrl: "www.baidu.com"
        // }
        let url = "http://quants.sufe.edu.cn/orderInfo";
        this.httpService.post(url).subscribe(result => {
            this.httpResponseData = result['_body'];
            console.log("orderInfor:");
            console.info(this.httpResponseData);
            this.payInfo = result['_body'];
            this.alipay.pay(this.payInfo)
                .then(res => {
                    console.info("res:");
                    console.log(res);
                    this.payResult = res;
                }, err => {
                    console.log(err);
                    this.payResult = err;
                })
                .catch(e => {
                    console.log(e);
                    this.payResult = e;
                });

        }, error => {
            console.log(error);
            this.nativeService.showToast("返回订单信息失败");

        });


    }

}

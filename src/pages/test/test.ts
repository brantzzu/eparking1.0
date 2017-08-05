import { Component } from '@angular/core';
import 'rxjs/add/operator/map';
import { TestService } from "./TestService";
import { FileObj } from "../../model/FileObj";

declare var AliPay: any;

@Component({
  selector: 'page-test',
  templateUrl: 'test.html',
})
export class TestPage {
  fileObjList: FileObj[] = [];


  constructor(public testService: TestService) {

  }

  ngAfterViewInit() {


  }

  getFileData() {
    this.testService.getFileData().subscribe(res => {
      this.fileObjList = res;
    });
  }

  /**
   * 支付宝支付
   */
  alipays() {
    //第二步：调用支付插件
    AliPay.pay({
      tradeNo: new Date().getTime(),
      subject: "测试标题",
      body: "我的两分钱啊",
      price: 0.02,
      notifyUrl: "www.baidu.com"
    },
      function success(e) {
        alert('success!');
      }, function error(e) {
        alert('error!');
        console.info(e);
      });
  }

}

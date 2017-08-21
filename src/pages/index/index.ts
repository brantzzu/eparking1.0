import { Component, ViewChild } from '@angular/core';
import 'rxjs/add/operator/map';
import { TestService } from "./TestService";
// import { FileObj } from "../../model/FileObj";
import { Slides, NavController, Tabs } from 'ionic-angular';
import { HomePage } from '../home/home';

declare var AliPay: any;

@Component({
  selector: 'page-index',
  templateUrl: 'index.html',
})
export class IndexPage {
  //fileObjList: FileObj[] = [];
  tab: Tabs;
  @ViewChild(Slides) slides: Slides;

  slideinfos = [
    {
      title: "倚泊智能停车",
      description: "让停车变得更简单...",
      image: "./assets/img/eparking1.png",
    },
    {
      title: "智能导航,无停进场,无感支付",
      description: "",
      image: "./assets/img/eparking2.jpg",
    },
    {
      title: "VIP停车服务",
      description: "",
      image: "./assets/img/eparking2.jpg",
    }
  ];

  constructor(public testService: TestService,
    private navCtrl: NavController
  ) {
    this.tab = this.navCtrl.parent;

  }
  ionViewDidEnter() {
    this.slides.startAutoplay();
  }

  ionViewDidLeave() {
    this.slides.stopAutoplay();
  }

  ngAfterViewInit() {
    this.slides.autoplay = true;
  }
  ngOnInit() {
    setInterval(() => {
      this.slides.slideNext(300, true);
    }, 3000);

  }
  goToParkingLot() {
    //this.navCtrl.push(HomePage);
    this.tab.select(1);
  }

  // getFileData() {
  //   this.testService.getFileData().subscribe(res => {
  //     this.fileObjList = res;
  //   });
  // }

  /**
   * 支付宝支付
   */
  // alipays() {
  //   //第二步：调用支付插件
  //   AliPay.pay({
  //     tradeNo: new Date().getTime(),
  //     subject: "测试标题",
  //     body: "我的两分钱啊",
  //     price: 0.02,
  //     notifyUrl: "www.baidu.com"
  //   },
  //     function success(e) {
  //       alert('success!');
  //     }, function error(e) {
  //       alert('error!');
  //       console.info(e);
  //     });
  // }

}

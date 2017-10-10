import { Component, ViewChild } from '@angular/core';
import 'rxjs/add/operator/map';
import { TestService } from "./TestService";
// import { FileObj } from "../../model/FileObj";
import { Slides, NavController, ModalController, Tabs, Platform } from 'ionic-angular';
import { NativeService } from "../../providers/NativeService";
import { NavigationModalPage } from "../home/navigation-modal/navigation-modal";
import { Geolocation } from '@ionic-native/geolocation';

declare var AMap;

@Component({
  selector: 'page-first',
  templateUrl: 'first.html',
})
export class FirstPage {
  //fileObjList: FileObj[] = [];
  tab: Tabs;
  map: any;
  mapIsComplete: boolean = false;//地图是否加载完成
  isPositioning: boolean = false;//是否正在定位
  marker: any;//地图坐标点信息
  locationLng: any;
  locationLat: any;
  address: String;
  nearbyParkingLotsNum: any;
  nearbyMarkers: any;
  recommendParkingLot: any;
  noNearbyParkingLot: boolean = true;

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
      image: "./assets/img/eparking2.png",
    },
    {
      title: "VIP停车服务",
      description: "",
      image: "./assets/img/eparking2.png",
    }
  ];

  constructor(public testService: TestService,
    private nativeService: NativeService,
    private navCtrl: NavController,
    private geolocation: Geolocation,
    private modalCtrl: ModalController,
    private platform: Platform
  ) {
    this.tab = this.navCtrl.parent;
    this.platform.ready().then((readySource) => {
      console.log('Platform ready from', readySource);
      this.mapLocation();
    });
  }

  ngAfterContentInit() {
    this.loadMap();
    //this.mapLocation();
    //this.searchNearbyParkingLots();
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

  loadMap() {
    let that = this;
    try {
      that.map = new AMap.Map('nearByParkingLot', {
        view: new AMap.View2D({//创建地图二维视口
          zoom: 11, //设置地图缩放级别
          rotateEnable: true,
          showBuildingBlock: true
        })
      });
      that.map.on('complete', () => {
        that.mapIsComplete = true;
        AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], () => {//添加工具条和比例尺
          that.map.addControl(new AMap.ToolBar());
          that.map.addControl(new AMap.Scale());
        });

      });
      this.map.on('click', (e) => {
        this.tab.select(1);
      });
    } catch (err) {
      that.mapIsComplete = false;
      that.nativeService.showToast('地图加载失败,请检查网络或稍后再试.')
    }

  }
  mapLocation() {
    // let that = this;
    this.isPositioning = true;
    this.nativeService.getUserLocation().subscribe(position => {
      this.marker = new AMap.Marker({
        map: this.map,
        //icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png",
        icon: "./assets/img/location.png",
        position: new AMap.LngLat(position['lng'], position['lat']),

      });
      this.locationLng = position['lng'];
      this.locationLat = position['lat']
      this.address = position['address'];
      this.map.setFitView();
      this.map.setZoom(16);
      this.isPositioning = false;
      this.nativeService.searchNearbyParkingLots(this.locationLng, this.locationLat).subscribe(markers => {
        this.recommendParkingLot = markers.recommendParkingLot;
        this.nearbyParkingLotsNum = markers.nearbyParkingLotsNum;
        console.log(this.recommendParkingLot);
        if (markers.nearbyParkingLotsNum > 0) {
          this.noNearbyParkingLot = false;
        }
      });

    }, () => {
      this.isPositioning = false;
    });

  }

  mapNavigation(navigationType, destinationLng, destinationLat) {
    //let markerData = this.marker.getExtData();
    if (!destinationLng || !destinationLat) {
      this.nativeService.showToast('请选择您要去的停车场');
      return;
    }
    let modal = this.modalCtrl.create(NavigationModalPage, {
      'navigationType': navigationType,
      'markerLocation': { 'lng': destinationLng, 'lat': destinationLat }
    });
    modal.present();
    modal.onDidDismiss(marker => {
      if (marker) {
      }
    });
  }
}

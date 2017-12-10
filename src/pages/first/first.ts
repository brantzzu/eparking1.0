import { Component, ViewChild, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map';
import { TestService } from "./TestService";
// import { FileObj } from "../../model/FileObj";
import { Slides, NavController, ModalController, Tabs, Platform, ViewController } from 'ionic-angular';
import { NativeService } from "../../providers/NativeService";
import { NavigationModalPage } from "../home/navigation-modal/navigation-modal";

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
  mapInitialised: boolean = false;
  apiKey: any = "39d5ce75adbc78bdffd0c9fe13e3b5eb";

  @ViewChild(Slides) slides: Slides;
  @ViewChild('map_container') map_container: ElementRef;
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
    private modalCtrl: ModalController,
    public viewCtrl: ViewController,
    private platform: Platform
  ) {
    this.tab = this.navCtrl.parent;
    this.platform.ready().then((readySource) => {
      console.log('Platform ready from', readySource);
      this.mapLocation();
    });
  }

  ionViewDidLoad() {
    this.loadMap();
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
    this.tab.select(1);
  }

  //地图加载
  loadMap() {
    this.addConnectivityListeners();
    if (typeof AMap == "undefined" || typeof AMap.Map == "undefined") {
      console.log(" maps JavaScript needs to be loaded.");
      if (this.nativeService.isConnecting()) {
        console.log("online, loading map");
        //Load the SDK
        window['mapInit'] = () => {
          this.initMap();
        }
        let script = document.createElement("script");
        script.id = "gaodeMaps";
        script.src = 'http://webapi.amap.com/maps?v=1.3&key=' + this.apiKey + '&plugin=AMap.CitySearch&callback=mapInit';
        document.body.appendChild(script);
      }
    } else {
      if (this.nativeService.isConnecting()) {
        console.log("showing map");
        this.initMap();
      }
    }
  }

  //初始化地图
  initMap() {
    this.mapInitialised = true;
    try {
      this.map = new AMap.Map(this.map_container.nativeElement, {
        view: new AMap.View2D({//创建地图二维视口
          zoom: 11, //设置地图缩放级别
          rotateEnable: true,
          showBuildingBlock: true
        })
      });
      this.map.on('complete', () => {
        this.mapIsComplete = true;
        AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], () => {//添加工具条和比例尺
          this.map.addControl(new AMap.ToolBar());
          this.map.addControl(new AMap.Scale());
        });

      });
      this.map.on('click', (e) => {
        this.tab.select(1);
      });
    } catch (err) {
      this.mapIsComplete = false;
      console.log("loadMap error:" + err);
      this.nativeService.showToast('地图加载失败,请检查网络或稍后再试.')
    }
  }
  mapLocation() {
    this.isPositioning = true;
    this.nativeService.getUserLocation().subscribe(position => {
      this.marker = new AMap.Marker({
        map: this.map,
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

  //地图导航
  mapNavigation(navigationType, destinationLng, destinationLat) {
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

  //刷新页面重新load地图
  doRefresh(refresher) {
    console.log('开始刷新操作', refresher);
    setTimeout(() => {
      this.loadMap();
      this.mapLocation();
      console.log('异步刷新结束...');
      refresher.complete();
    }, 2000);
  }

  //监听网络连接状态
  addConnectivityListeners() {
    let onOnline = () => {
      setTimeout(() => {
        if (typeof AMap == "undefined" || typeof AMap.Map == "undefined") {
          this.loadMap();
          this.mapLocation();
        } else {
          if (!this.mapInitialised) {
            this.nativeService.showToast("网络已连接，请下拉刷新页面");
          }
        }

      }, 2000);
      // setTimeout(() => {
      //   if (typeof AMap == "undefined" || typeof AMap.Map == "undefined") {
      //     this.loadMap();
      //     this.mapLocation();
      //   } else {
      //     if (!this.mapInitialised) {
      //       this.initMap();
      //     }
      //   }
      // }, 2000);
      //this.doRefresh(event);
    };
    let onOffline = () => {
    };
    document.addEventListener('online', onOnline, false);
    document.addEventListener('offline', onOffline, false);
  }
}

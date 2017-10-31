import { Component, ViewChild, Renderer } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ModalController, Searchbar, ViewController, Platform } from 'ionic-angular';
import { NativeService } from "../../providers/NativeService";
import { NavigationModalPage } from "./navigation-modal/navigation-modal";
import { LocationSearchModalPage } from "./location-search-modal/location-search-modal";
import { HttpService } from "../../providers/HttpService";
import { MARKER_URL } from "../../providers/Constants";

declare var AMap;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('searchBar') searchBar: Searchbar;
  isIos: boolean;
  mapIsComplete: boolean = false;//地图是否加载完成
  showIonFab: boolean = false;//是否显示路线按钮
  isPositioning: boolean = false;//是否正在定位
  map: any;//地图对象
  marker: any;//地图坐标点信息
  locationLng: any;
  locationLat: any;
  searchMarkers: any = [];
  clickMarkers: any = [];
  url: string = MARKER_URL;
  address: string;
  nearbyParkingLotsNum: any;
  nearbyMarkers: any;
  recommendParkingLot: any;
  noNearbyParkingLot: boolean = true;

  constructor(private modalCtrl: ModalController,
    public platform: Platform,
    private viewCtrl: ViewController,
    private storage: Storage,
    private httpService: HttpService,
    private renderer: Renderer,
    private nativeService: NativeService) {
    this.isIos = this.nativeService.isIos();
    this.platform.ready().then((readySource) => {
      console.log('Platform ready from', readySource);
      this.mapLocation();
    });
  }

  ngAfterContentInit() {
    this.loadMap();
    setTimeout(() => {
      if (!this.map) {
        this.loadMap();
      }
    }, 5000);
    //this.mapLocation();
    // this.initMarker();
  }

  loadMap() {
    try {
      this.map = new AMap.Map('map_container', {
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
      window['HomeAMap'] = this.map;
    } catch (err) {
      this.mapIsComplete = false;
      this.nativeService.showToast('地图加载失败,请检查网络或稍后再试.')
    }
  }
  /**
   * 地址搜索框
   */
  ionFocus() {
    //let that = this;
    let modal = this.modalCtrl.create(LocationSearchModalPage);
    modal.present();
    modal.onDidDismiss(marker => {
      if (marker) {
        //this.showIonFab = true;
        //this.marker.push(marker.location.lng, marker.location.lat);
        this.map.clearMap();
        // for (let i = 0; i < this.searchMarkers.length; i++) {
        //   console.log("remove marker:" + this.searchMarkers[i].title);
        //   this.map.remove(this.searchMarkers[i]);
        // }
        let newmarker = new AMap.Marker({
          map: this.map,
          id: marker.id,
          icon: "./assets/img/pin.png",
          position: new AMap.LngLat(marker.location.lng, marker.location.lat),
          extData: marker,
          title: marker.name
        });
        // console.log(newmarker['extData']);
        // console.log(newmarker.G);
        // console.log(newmarker.c);
        //this.searchMarkers.push(newmarker);
        //this.map.setFitView();
        newmarker.setMap(this.map);
        this.map.setZoomAndCenter(16, [marker.location.lng, marker.location.lat]);
        this.address = newmarker.G.title;
        this.nativeService.searchNearbyParkingLots(marker.location.lng, marker.location.lat).subscribe(markers => {
          this.nearbyMarkers = markers.nearbyMarkers;
          this.noNearbyParkingLot = false;
          this.initMarker();
        });
      }
    });
  }
  /**
   * 地图定位
   */
  mapLocation() {
    this.isPositioning = true;
    this.nativeService.getUserLocation().subscribe(position => {
      this.map.clearMap();
      this.marker = new AMap.Marker({
        map: this.map,
        //icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png",
        icon: "./assets/img/location.png",
        position: new AMap.LngLat(position['lng'], position['lat']),
      });
      this.locationLng = position['lng'];
      this.locationLat = position['lat'];
      this.address = position['address'];
      this.map.setFitView();
      this.map.setZoom(16);
      this.isPositioning = false;
      this.nativeService.searchNearbyParkingLots(position['lng'], position['lat']).subscribe(markers => {
        this.nearbyMarkers = markers.nearbyMarkers;
        this.noNearbyParkingLot = false;
        this.initMarker();
      });
    }, () => {
      this.isPositioning = false;
    });
    //this.initMarker();
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
  /**
   * 初始化停车场Marker
   */
  initMarker() {
    this.nativeService.getUserCity().subscribe(city => {
      console.info("start initMarker()");
      AMap.plugin(['AMap.Geocoder'],
        () => {
          //console.info("start geocoder()");
          let geocoder = new AMap.Geocoder({
            city: city, //城市，默认：“全国”
            radius: 1000 //范围，默认：500
          });
          for (let i = 0; i < this.nearbyMarkers.length; i++) {
            //console.log("address:" + this.nearbyMarkers[i].address);
            geocoder.getLocation(this.nearbyMarkers[i].address, (status, result) => {
              if (status === 'complete' && result.info === 'OK') {
                //console.log("parkingLotLocation:" + parkingLotLocation);
                this.loadParkingLocation_CallBacks(result, this.nearbyMarkers[i].address, this.nearbyMarkers[i].distance, this.nearbyMarkers[i].name, this.nearbyMarkers[i].type);
              }
            });
          }
        });
    });
  }

  loadParkingLocation_CallBacks(data, address, distance, parkingLotName, parkingType) {
    //let resultStr = "";
    //地理编码结果数组
    let geocode = data.geocodes;
    for (let i = 0; i < geocode.length; i++) {
      this.addMarkers(i, geocode[i], address, distance, parkingLotName, parkingType);
    }
  }

  addMarkers(i, d, address, distance, parkingLotName, parkingType) {
    let marker = new AMap.Marker({
      map: this.map,
      icon: "./assets/img/marker.png",// "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
      position: [d.location.getLng(), d.location.getLat()]
    });
    marker['address'] = address;
    marker['distance'] = distance;
    marker['parkingLotName'] = parkingLotName;
    marker['parkingType'] = parkingType;
    AMap.event.addListener(marker, 'click', (e) => {
      for (let i = 0; i < this.clickMarkers.length; i++) {
        this.clickMarkers[i].setIcon("./assets/img/marker.png");
      }
      marker.setIcon("./assets/img/markerClick.png");
      this.clickMarkers.push(marker);
      let info = [];
      info.push("<span style=\"font-weight:bold\">" + marker['parkingLotName'] + "</span> <br />");
      info.push("<div class=\"div-left\">" + marker['distance'] + "米</div><div id=\"clickbutton\"><img src='./assets/img/navigation.png'></div>");
      let infoWindow = new AMap.InfoWindow({
        content: info.join("<br />"),
        offset: { x: 0, y: -30 }
      });
      infoWindow.open(this.map, marker.getPosition());
      setTimeout(() => {
        let bt = document.getElementById("clickbutton");
        bt.addEventListener('click', (event) => {
          this.mapNavigation(1, d.location.getLng(), d.location.getLat());
        });
      }, 1000);
    });
  }

  // getMarkers() {
  //   return this.httpService.get(this.url, null).map(res => {
  //     return res.json();
  //   });
  // }
}

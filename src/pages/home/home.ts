import { Component, ViewChild, Renderer } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ModalController, Searchbar, ViewController } from 'ionic-angular';
import { NativeService } from "../../providers/NativeService";
import { NavigationModalPage } from "./navigation-modal/navigation-modal";
import { LocationSearchModalPage } from "./location-search-modal/location-search-modal";
import { HttpService } from "../../providers/HttpService";
import { MARKER_URL } from "../../providers/Constants";
import { Subject } from "rxjs";

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
  url: string = MARKER_URL;
  constructor(private modalCtrl: ModalController,
    private viewCtrl: ViewController,
    private storage: Storage,
    private httpService: HttpService,
    private renderer: Renderer,
    private nativeService: NativeService) {
    this.isIos = this.nativeService.isIos();
  }

  ngAfterContentInit() {
    this.loadMap();
    setTimeout(() => {
      if (!this.map) {
        this.loadMap();
      }
    }, 5000);
    this.mapLocation();
    // this.initMarker();
  }

  loadMap() {
    let that = this;
    try {
      that.map = new AMap.Map('map_container', {
        view: new AMap.View2D({//创建地图二维视口
          zoom: 11, //设置地图缩放级别
          rotateEnable: true,
          showBuildingBlock: true
        })
      });
      that.map.on('complete', function () {
        that.mapIsComplete = true;
        AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], function () {//添加工具条和比例尺
          that.map.addControl(new AMap.ToolBar());
          that.map.addControl(new AMap.Scale());
        });
      });
      this.map.on('click', function (e) {
        document.getElementById("markerinfo").style.display = "none";
      });
      window['HomeAMap'] = this.map;
    } catch (err) {
      that.mapIsComplete = false;
      that.nativeService.showToast('地图加载失败,请检查网络或稍后再试.')
    }

  }
  /**
   * 地址搜索框
   */
  ionFocus() {
    let that = this;
    let modal = this.modalCtrl.create(LocationSearchModalPage);
    modal.present();
    modal.onDidDismiss(marker => {
      if (marker) {
        //that.showIonFab = true;
        //that.marker.push(marker.location.lng, marker.location.lat);
        //that.map.clearMap();
        for (let i = 0; i < this.searchMarkers.length; i++) {
          console.log("remove marker:" + this.searchMarkers[i].title);
          that.map.remove(this.searchMarkers[i]);
        }

        let newmarker = new AMap.Marker({
          map: that.map,
          id: marker.id,
          icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png",
          position: new AMap.LngLat(marker.location.lng, marker.location.lat),
          extData: marker,
          title: marker.name
        });
        this.searchMarkers.push(newmarker);
        newmarker.setMap(that.map);
        that.map.setFitView();
        that.map.setZoom(13);
      }
    });
  }

  /**
   * 地图定位
   */

  mapLocation() {
    let that = this;
    that.isPositioning = true;
    that.nativeService.getUserLocation().subscribe(position => {
      that.map.clearMap();
      that.marker = new AMap.Marker({
        map: that.map,
        //icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png",
        icon: "./assets/img/pin.png",
        position: new AMap.LngLat(position['lng'], position['lat']),

      });
      that.locationLng = position['lng'];
      that.locationLat = position['lat']
      that.map.setFitView();
      that.map.setZoom(16);
      that.isPositioning = false;
    }, () => {
      that.isPositioning = false;
    });
    that.initMarker();
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

  /** add Markers */
  addMarker(i, d): any {
    var lngX = d.location.getLng();
    var latY = d.location.getLat();
    var markerOption = {
      map: this.map,
      icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
      position: [lngX, latY],
      topWhenMouseOver: true
    };
    this.marker.push([lngX, latY]);
    return new AMap.Marker(markerOption);
  }

  /**
   * 初始化停车场Marker
   */
  initMarker() {
    console.info("start initMarker()");
    AMap.plugin(['AMap.Geocoder'], () => {
      console.info("start geocoder()");
      let geocoder = new AMap.Geocoder({
        city: "上海", //城市，默认：“全国”
        radius: 1000 //范围，默认：500
      });
      this.getMarkers().subscribe((json: any) => {
        console.info('get markers return date()');
        // console.info(JSON.stringify(json));
        for (let i = 0; i < json.length; i++) {
          let parkingLotLocation = json[i].location;
          let parkingLotName = json[i].parkingLotName;
          let accountingStandards = json[i].accountingStandards;
          let berthNo = json[i].berthNo;
          let parkingLotProperty = json[i].parkingLotProperty;
          let ServiceTime = json[i].serviceTime;
          geocoder.getLocation(parkingLotLocation, (status, result) => {
            //console.info("get location() => parkingLotLocation:" + parkingLotLocation);
            if (status === 'complete' && result.info === 'OK') {
              //console.log("parkingLotLocation:" + parkingLotLocation);
              this.loadParkingLocation_CallBacks(result, parkingLotName, accountingStandards.toString(),
                berthNo.toString(), parkingLotProperty, ServiceTime);
            }
          });
        }
      });
    });
  }

  loadParkingLocation_CallBacks(data, parkingLotName, accountingStandards, berthNo, parkingLotProperty, ServiceTime) {
    //let resultStr = "";
    //地理编码结果数组
    let geocode = data.geocodes;
    for (let i = 0; i < geocode.length; i++) {
      this.addMarkers(i, geocode[i], parkingLotName, accountingStandards, berthNo, parkingLotProperty, ServiceTime);
    }
  }

  addMarkers(i, d, parkingLotName, accountingStandards, berthNo, parkingLotProperty, ServiceTime) {
    let marker = new AMap.Marker({
      iconLabel: '1',
      map: this.map,
      draggable: true,
      position: [d.location.getLng(), d.location.getLat()]
    });

    let infoWindow = new AMap.InfoWindow({
      content: d.formattedAddress,
      offset: { x: 0, y: -30 }
    });
    marker.on("mouseover", (e) => {
      infoWindow.open(this.map, marker.getPosition());
    });

    marker['parkingLotName'] = parkingLotName;
    marker['parkingLotProperty'] = parkingLotProperty;
    marker['ServiceTime'] = ServiceTime;
    marker['berthNo'] = berthNo;
    marker['accountingStandards'] = accountingStandards;
    let lnglat = new AMap.LngLat(this.locationLng, this.locationLat);
    let distances = (lnglat.distance([d.location.getLng(), d.location.getLat()]) / 1000).toFixed(2);
    // let infoTitle = marker['parkingLotName'];
    let info = [];
    // info.push("<div>距离目的地:" + distances.toString() + "公里</div>");
    // info.push("<div><button>" + marker['parkingLotProperty'] + "</button>&nbsp;&nbsp;" + "<button>" + marker['ServiceTime'] + "</div>");
    // info.push("<div>空闲车位数：" + marker['berthNo'] + " |收费标准:" + marker['accountingStandards'] + "元/小时</div>");
    // info.push('<div><button id="dh">导航</button></div>');
    info.push('<div class="row"><div class="col col-50">' + parkingLotName + '</div><div class="col col-50">距离目的地:' + distances.toString() + '公里</div></div>');
    info.push('<button ion-button>' + parkingLotProperty + '</button>&nbsp;&nbsp;<button ion-button>' + ServiceTime + '</button>');
    info.push('<div class="row"><div class="col col-70">空闲车位数：' + berthNo + ' |收费标准:' + accountingStandards + '元/小时</div><div class="col col-30" id="navigationButton"><button id="navigation">导航</button></div></div>');

    AMap.event.addListener(marker, 'click', (e) => {
      //let divstr = '<button id="daohangButton" (click)="mapNavigation(1)">去这里</button>';
      document.getElementById("markerinfo").innerHTML = info.join("<br/>");
      document.getElementById("markerinfo").style.display = "block";
      let bt = document.getElementById("navigation");
      this.renderer.listen(bt, 'click', (event) => {
        this.mapNavigation(1, d.location.getLng(), d.location.getLat());
      });
      //infoWindow1.open(this.map, marker.getPosition());
    });

  }

  getMarkers() {
    return this.httpService.get(this.url, null).map(res => {
      return res.json();
    });
  }

}

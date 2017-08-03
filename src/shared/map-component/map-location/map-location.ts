import {Component, Input} from '@angular/core';
import {NavController, NavParams, ModalController, IonicPage} from 'ionic-angular';
import {SearchAddress} from "../search-address/search-address";
import {Navigation} from "../navigation/navigation";
import {NativeService} from "../../../providers/NativeService";
declare var AMap;
/**
 * Generated class for the MapLocation page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-map-location',
  templateUrl: 'map-location.html',
})
export class MapLocation {
  map: any;//地图对象
  mapIsComplete: boolean = false;//地图是否加载完成
  isPositioning: boolean = false;//是否正在定位
  marker: any;//标注
  markerAddress: any;//搜索框的值
  showIonFab: boolean = false;//是否显示导航按钮
  @Input()
  draggable: boolean = true;//标注是否可以拖拽;
  @Input()
  click: boolean = false;//地图是否点击改变标注的位置
  @Input()
  address: any; //主页面传过来的地址
  @Input()
  position: any;//主页面传过来的坐标
  @Input()
  lnglatXY: any;//双向数据绑定,把标注的经纬坐标传到主页面
  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController,
              public  nativeService: NativeService,
              public navParams: NavParams) {
  }

  ngAfterContentInit() {
    this.loadMap();
    setTimeout(() => {
      if (!this.map) {
        this.loadMap();
      }
    }, 3000);
  }

  //加载地图
  private loadMap() {
    let that = this;
    try {
      that.map = new AMap.Map('map-share', {
        view: new AMap.View2D({//创建地图二维视口
          zoom: 14, //设置地图缩放级别
          rotateEnable: true,
          showBuildingBlock: true,
          baseRender: 'd'
        })
      });

      that.map.on('complete', function () {
        that.mapIsComplete = true;
        AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], function () {//添加工具条和比例尺
          that.map.addControl(new AMap.ToolBar());
        });
        if (that.address) {//判断主页面传过来的是地址就跳转到地址搜索地址页面,返回确定的地址
          that.markerAddress=that.address;
          that.locationSearch();
        } else if (that.position) {//判断主页面传过来的是坐标就直接描点标注
          that.drawMarker(that.position);
        }
        if (that.click) { //判断是否可以点击地图改变标注位置
          that.map.on('click', function (e) {
            let position = {
              lng: e.lnglat.getLng(),
              lat: e.lnglat.getLat()
            };
            that.drawMarker(position);
          });
        }

      });
      window['HomeAMap'] = this.map;
    } catch (err) {
      that.mapIsComplete = false;
      that.nativeService.showToast('地图加载失败,请检查网络或稍后再试.')
    }
  }

//跳转到地址查询搜索页面,并返回一个地址对象(经纬坐标+中文地址)
  private locationSearch() {
    let that = this;
    let locationSearchModal = that.modalCtrl.create(SearchAddress, {address: that.markerAddress});
    locationSearchModal.present();
    locationSearchModal.onDidDismiss(item=> {
      if(item){
        that.address = item;
        this.drawMarker(that.address.location);
      }
    })
  }

//定位当前地址
  mapLocation() {
    let that = this;
    that.isPositioning = true;
    that.nativeService.getUserLocation().subscribe(position => {
      that.drawMarker(position);
      that.isPositioning = false;
    }, () => {
      that.isPositioning = false;
    });
  }

//描点标注
  private drawMarker(position) {
    let that = this;
    that.lnglatXY = new AMap.LngLat(position['lng'], position['lat']);
    that.map.clearMap();

    //根据传进来的position参数给搜索框的赋值
    if (that.address && position === that.address.location) {
      that.markerAddress = that.address.name;
    } else if (position === that.position) {
      that.markerAddress = '';
    } else {
      that.geocoder(that.lnglatXY);
    }

    that.marker = new AMap.Marker({
      map: that.map,
      draggable: that.draggable,//控制标注是否可以拖拽
      position: that.lnglatXY,
    });

    if (that.marker) {
      that.showIonFab = true;
    }

    //拖拽标注
    that.marker.on('dragend', function (e) {
      let position = {
        lng: e.lnglat.getLng(),
        lat: e.lnglat.getLat()
      };
      that.drawMarker(position);
    });

    that.map.setFitView();
  }

  //根据经纬坐标获取对应的地址
  private geocoder(position) {
    let that = this;
    let geocoder = new AMap.Geocoder({
      radius: 1000,
      extensions: "all"
    });
    geocoder.getAddress(position, function (status, result) {
      if (status === 'complete' && result.info === 'OK') {
        //获得了有效的地址信息:
        let addressComponent = result.regeocode.addressComponent;
        that.markerAddress = addressComponent.district + addressComponent.township +
          addressComponent.street + addressComponent.streetNumber;
      } else {
        that.markerAddress = '';
      }
    });
  }

//导航函数
  mapNavigation(navigationType) {//1驾车,2公交,3步行
    let markerPosition = this.marker.getPosition();
    if (!markerPosition) {
      this.nativeService.showToast('请先搜索要去的地点');
      return;
    }
    let modal = this.modalCtrl.create(Navigation, {
      'navigationType': navigationType,
      'markerLocation': {'lng': markerPosition.lng, 'lat': markerPosition.lat}
    });
    modal.present();
  }

}


import { Injectable } from '@angular/core';
import { ToastController, LoadingController, Platform, Loading, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AppVersion } from '@ionic-native/app-version';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Toast } from '@ionic-native/toast';
import { File, FileEntry } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ImagePicker } from '@ionic-native/image-picker';
import { Network } from '@ionic-native/network';
import { AppMinimize } from "@ionic-native/app-minimize";
import { Position, NearbyMarkers } from "../model/type";
import { APP_DOWNLOAD, APK_DOWNLOAD, IMAGE_SIZE, QUALITY_SIZE } from "./Constants";
import { GlobalData } from "./GlobalData";
import { Observable } from "rxjs";
declare var LocationPlugin;
declare var AMapNavigation;
declare var AMap;

@Injectable()
export class NativeService {
  private loading: Loading;
  private loadingIsOpen: boolean = false;

  constructor(private platform: Platform,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private appVersion: AppVersion,
    private camera: Camera,
    private toast: Toast,
    private transfer: Transfer,
    private file: File,
    private inAppBrowser: InAppBrowser,
    private imagePicker: ImagePicker,
    private network: Network,
    private appMinimize: AppMinimize,
    private loadingCtrl: LoadingController,
    private globalData: GlobalData

  ) {
  }

  log(info): void {
    console.log('%cNativeService/' + info, 'color:#C41A16');
  }

  /**
   * 使用默认状态栏
   */
  statusBarStyleDefault(): void {
    this.statusBar.styleDefault();
  }

  /**
   * 隐藏启动页面
   */
  splashScreenHide(): void {
    this.splashScreen.hide();
  }

  /**
   * 获取网络类型 如`unknown`, `ethernet`, `wifi`, `2g`, `3g`, `4g`, `cellular`, `none`
   */
  getNetworkType(): string {
    if (!this.isMobile()) {
      return 'wifi';
    }
    return this.network.type;
  }

  /**
   * 判断是否有网络
   */
  isConnecting(): boolean {
    return this.getNetworkType() != 'none';
  }

  /**
   * 调用最小化app插件
   */
  minimize(): void {
    this.appMinimize.minimize()
  }

  /**
   * 通过浏览器打开url
   */
  openUrlByBrowser(url: string): void {
    this.inAppBrowser.create(url, '_system');
  }

  /**
   * 检查app是否需要升级
   */
  detectionUpgrade(): void {
    //这里连接后台判断是否需要升级,不需要升级就return
    this.alertCtrl.create({
      title: '升级',
      subTitle: '发现新版本,是否立即升级？',
      buttons: [{ text: '取消' },
      {
        text: '确定',
        handler: () => {
          this.downloadApp();
        }
      }
      ]
    }).present();
  }

  /**
   * 下载安装app
   */
  downloadApp(): void {
    if (this.isAndroid()) {
      let alert = this.alertCtrl.create({
        title: '下载进度：0%',
        enableBackdropDismiss: false,
        buttons: ['后台下载']
      });
      alert.present();

      const fileTransfer: TransferObject = this.transfer.create();
      const apk = this.file.externalRootDirectory + 'android.apk'; //apk保存的目录

      fileTransfer.download(APK_DOWNLOAD, apk).then(() => {
        window['install'].install(apk.replace('file://', ''));
      });

      fileTransfer.onProgress((event: ProgressEvent) => {
        let num = Math.floor(event.loaded / event.total * 100);
        if (num === 100) {
          alert.dismiss();
        } else {
          let title = document.getElementsByClassName('alert-title')[0];
          title && (title.innerHTML = '下载进度：' + num + '%');
        }
      });
    }
    if (this.isIos()) {
      this.openUrlByBrowser(APP_DOWNLOAD);
    }
  }

  /**
   * 是否真机环境
   */
  isMobile(): boolean {
    return this.platform.is('mobile') && !this.platform.is('mobileweb');
  }

  /**
   * 是否android真机环境
   */
  isAndroid(): boolean {
    return this.isMobile() && this.platform.is('android');
  }

  /**
   * 是否ios真机环境
   */
  isIos(): boolean {
    return this.isMobile() && (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone'));
  }

  alert(title: string): void {
    this.alertCtrl.create({
      title: title,
      buttons: [{ text: '确定' }]
    }).present();
  }

  /**
   * 统一调用此方法显示提示信息
   * @param message 信息内容
   * @param duration 显示时长
   */
  showToast(message: string = '操作完成', duration: number = 2000): void {
    if (this.isMobile()) {
      this.toast.show(message, String(duration), 'center').subscribe();
    } else {
      this.toastCtrl.create({
        message: message,
        duration: duration,
        position: 'middle',
        showCloseButton: false
      }).present();
    }
  };

  /**
   * 统一调用此方法显示loading
   * @param content 显示的内容
   */
  showLoading(content: string = ''): void {
    if (!this.globalData.showLoading) {
      return;
    }
    if (!this.loadingIsOpen) {
      this.loadingIsOpen = true;
      this.loading = this.loadingCtrl.create({
        content: content
      });
      this.loading.present();
      setTimeout(() => {//最长显示15秒
        this.loadingIsOpen && this.loading.dismiss();
        this.loadingIsOpen = false;
      }, 15000);
    }
  };

  /**
   * 关闭loading
   */
  hideLoading(): void {
    if (!this.globalData.showLoading) {
      this.globalData.showLoading = true;
    }
    this.loadingIsOpen && this.loading.dismiss();
    this.loadingIsOpen = false;
  };

  /**
   * 使用cordova-plugin-camera获取照片
   * @param options
   */
  getPicture(options: CameraOptions = {}): Observable<string> {
    let ops: CameraOptions = Object.assign({
      sourceType: this.camera.PictureSourceType.CAMERA,//图片来源,CAMERA:拍照,PHOTOLIBRARY:相册
      destinationType: this.camera.DestinationType.DATA_URL,//默认返回base64字符串,DATA_URL:base64   FILE_URI:图片路径
      quality: QUALITY_SIZE,//图像质量，范围为0 - 100
      allowEdit: true,//选择图片前是否允许编辑
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: IMAGE_SIZE,//缩放图像的宽度（像素）
      targetHeight: IMAGE_SIZE,//缩放图像的高度（像素）
      saveToPhotoAlbum: false,//是否保存到相册
      correctOrientation: true//设置摄像机拍摄的图像是否为正确的方向
    }, options);
    return Observable.create(observer => {
      this.camera.getPicture(ops).then((imgData: string) => {
        if (ops.destinationType === this.camera.DestinationType.DATA_URL) {
          observer.next('data:image/jpg;base64,' + imgData);
        } else {
          observer.next(imgData);
        }
      }).catch(err => {
        if (err == 20) {
          this.alert('没有权限,请在设置中开启权限');
          return;
        }
        if (String(err).indexOf('cancel') != -1) {
          return;
        }
        this.log('getPicture:' + err);
      });
    });
  };

  /**
   * 通过拍照获取照片
   * @param options
   */
  getPictureByCamera(options: CameraOptions = {}): Observable<string> {
    let ops: CameraOptions = Object.assign({
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL//DATA_URL: 0 base64字符串, FILE_URI: 1图片路径
    }, options);
    return this.getPicture(ops);
  };

  /**
   * 通过图库获取照片
   * @param options
   */
  getPictureByPhotoLibrary(options: CameraOptions = {}): Observable<string> {
    let ops: CameraOptions = Object.assign({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL//DATA_URL: 0 base64字符串, FILE_URI: 1图片路径
    }, options);
    return this.getPicture(ops);
  };

  /**
   * 通过图库选择多图
   * @param options
   */
  getMultiplePicture(options = {}): Observable<any> {
    let that = this;
    let ops = Object.assign({
      maximumImagesCount: 6,
      width: IMAGE_SIZE,//缩放图像的宽度（像素）
      height: IMAGE_SIZE,//缩放图像的高度（像素）
      quality: QUALITY_SIZE//图像质量，范围为0 - 100
    }, options);
    return Observable.create(observer => {
      this.imagePicker.getPictures(ops).then(files => {
        let destinationType = options['destinationType'] || 0;//0:base64字符串,1:图片url
        if (destinationType === 1) {
          observer.next(files);
        } else {
          let imgBase64s = [];//base64字符串数组
          for (let fileUrl of files) {
            that.convertImgToBase64(fileUrl).subscribe(base64 => {
              imgBase64s.push(base64);
              if (imgBase64s.length === files.length) {
                observer.next(imgBase64s);
              }
            })
          }
        }
      }).catch(err => {
        this.log('getMultiplePicture:' + err);
        this.alert('获取照片失败');
      });
    });
  };

  /**
   * 根据图片绝对路径转化为base64字符串
   * @param path 绝对路径
   */
  convertImgToBase64(path: string): Observable<string> {
    return Observable.create(observer => {
      this.file.resolveLocalFilesystemUrl(path).then((fileEnter: FileEntry) => {
        fileEnter.file(file => {
          let reader = new FileReader();
          reader.onloadend = function (e) {
            observer.next(this.result);
          };
          reader.readAsDataURL(file);
        });
      }).catch(err => {
        this.log('convertImgToBase64:' + err);
      });
    });
  }

  /**
   * 获得app版本号,如0.01
   * @description  对应/config.xml中version的值
   */
  getVersionNumber(): Observable<string> {
    return Observable.create(observer => {
      this.appVersion.getVersionNumber().then((value: string) => {
        observer.next(value);
      }).catch(err => {
        this.log('getVersionNumber:' + err);
      });
    });
  }

  /**
   * 获得app name,如ionic2_tabs
   * @description  对应/config.xml中name的值
   */
  getAppName(): Observable<string> {
    return Observable.create(observer => {
      this.appVersion.getAppName().then((value: string) => {
        observer.next(value);
      }).catch(err => {
        this.log('getAppName:' + err);
      });
    });
  }

  /**
   * 获得app包名/id,如com.kit.ionic2tabs
   * @description  对应/config.xml中id的值
   */
  getPackageName(): Observable<string> {
    return Observable.create(observer => {
      this.appVersion.getPackageName().then((value: string) => {
        observer.next(value);
      }).catch(err => {
        this.log('getPackageName:' + err);
      });
    });
  }

  /**
   * 获得用户当前坐标
   */
  getUserLocation(): Observable<Position> {
    return Observable.create(observer => {
      if (this.isMobile()) {
        LocationPlugin.getLocation(data => {
          observer.next({ 'lng': data.longitude, 'lat': data.latitude, 'address': data.address });
          // console.log("locationData:");
          // console.log(data);
        }, msg => {
          this.log('getUserLocation:' + msg);
          this.alert(msg.indexOf('缺少定位权限') == -1 ? ('错误消息：' + msg) : '缺少定位权限，请在手机设置中开启');
          observer.error('获取位置失败');
        });
      } else {
        console.log('非手机环境,即测试环境返回固定坐标');
        observer.next({ 'lng': 121.49509906768695, 'lat': 31.30709098883003 });
      }
    });
  }
  /**
 * 搜索附件的停车场
 */
  searchNearbyParkingLots(locationLng: string, locationLat: string): Observable<NearbyMarkers> {
    return Observable.create(observable => {
      AMap.plugin(['AMap.PlaceSearch'], () => {
        this.getUserCity().subscribe(city => {
          let placeSearch = new AMap.PlaceSearch({
            pageSize: 50,
            pageIndex: 1
          });
          placeSearch.setType('停车场');
          placeSearch.setCity(city);
          placeSearch.searchNearBy("", [locationLng, locationLat], 1000, (status, result) => {
            if (status === 'complete' && result.info === 'OK') {
              if (result.poiList.count > 0) {
                let nearbyMarkers = result.poiList.pois;
                let recommendParkingLot = nearbyMarkers[0];
                observable.next({ 'nearbyMarkers': nearbyMarkers, 'nearbyParkingLotsNum': result.poiList.count, 'recommendParkingLot': recommendParkingLot });
              }
            }
          });
        });
      });
    });
  }

  getUserCity(): Observable<String> {
    return Observable.create(observable => {
      let citysearch = new AMap.CitySearch();
      citysearch.getLocalCity((status, result) => {
        if (status === 'complete' && result.info === 'OK') {
          if (result && result.city && result.bounds) {
            let cityinfo = result.city;
            observable.next(cityinfo);
            //document.getElementById('tip').innerHTML = '您当前所在城市：' + cityinfo;
          }
        } else {
          observable.next("上海");
          //document.getElementById('tip').innerHTML = result.info;
        }
      });
    });
  }

  /**
   * 地图导航
   * @param startPoint 开始坐标
   * @param endPoint 结束坐标
   * @param type 0实时导航,1模拟导航,默认为模拟导航
   */
  navigation(startPoint: Position, endPoint: Position, type = 1): Observable<string> {
    return Observable.create(observer => {
      if (this.platform.is('mobile') && !this.platform.is('mobileweb')) {
        AMapNavigation.navigation({
          lng: startPoint.lng,
          lat: startPoint.lat
        }, {
            lng: endPoint.lng,
            lat: endPoint.lat
          }, type, message => {
            observer.next(message);
          }, err => {
            this.log('navigation:' + err);
            this.alert('导航失败');
          });
      } else {
        this.alert('非手机环境不能导航');
      }
    });
  }

}

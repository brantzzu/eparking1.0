import {Component, ViewChild, ElementRef} from '@angular/core';
import {IonicPage, NavParams, ViewController} from 'ionic-angular';
import {NativeService} from "../../../providers/NativeService";
declare var AMap;
/**
 * Generated class for the Navigation page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-navigation',
  templateUrl: 'navigation.html',
})
export class Navigation {

  @ViewChild('panel') panel: ElementRef;
  navigationType:number;
  navigationIsReady: boolean = false;
  map;
  startPoint;
  endPoint;

  constructor(private viewCtrl: ViewController,
              private nativeService: NativeService,
              private navParams: NavParams) {
    this.navigationType = navParams.get("navigationType");
    this.endPoint = navParams.get("markerLocation");
    this.map = window['HomeAMap'];
  }

  ngAfterContentInit() {
    let type = this.navigationType, options = {city: '广州市', panel: this.panel.nativeElement, map: this.map};
    if (type === 1) {
      AMap.service('AMap.Driving', () => {
        this.navigationIsReady = true;
        this.doSearch(type, new AMap.Driving(options));
      });
    } else if (type === 2) {
      AMap.service('AMap.Transfer', () => {
        this.doSearch(type, new AMap.Transfer(options));
      });
    } else if (type === 3) {
      AMap.service('AMap.Walking', () => {
        this.doSearch(type, new AMap.Walking(options));
      });
    }
  }

  doSearch(navigationType, navigationService) {
    this.nativeService.getUserLocation().subscribe(location => {
      this.map.clearMap();
      this.startPoint = location;
      navigationService.search([this.startPoint.lng, this.startPoint.lat], [this.endPoint.lng, this.endPoint.lat], (status, result) => {

      });
    });
  }

  doNavigation(type) {// 0实时导航,1模拟导航
    this.nativeService.navigation(this.startPoint, this.endPoint, type).subscribe(message => {
      debugger;
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}

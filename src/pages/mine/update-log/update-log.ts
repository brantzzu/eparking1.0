import {Component} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';

/*
 Generated class for the UpdateLog page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-update-log',
  templateUrl: 'update-log.html'
})
export class UpdateLogPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}

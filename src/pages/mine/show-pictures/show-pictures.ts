import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';

/*
  Generated class for the ShowPictures page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-show-pictures',
  templateUrl: 'show-pictures.html'
})
export class ShowPicturesPage {
  imagePaths: string[];

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private viewCtrl: ViewController

  ) {
    this.imagePaths = navParams.data.imagePaths;
  }
 deletePictures(i){
   this.imagePaths.splice(i,1);
   if(this.imagePaths.length==0){
     this.dismiss()
   }
 }
  dismiss() {
    this.viewCtrl.dismiss(this.imagePaths);
  }

}

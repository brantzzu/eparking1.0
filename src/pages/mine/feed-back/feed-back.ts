import {Component} from '@angular/core';
import {FileObj} from "../../../model/FileObj";
import {NavController} from "ionic-angular";
import {FileService} from "../../../providers/FileService";
@Component({
  selector: 'page-feed-back',
  templateUrl: 'feed-back.html'
})
export class FeedBackPage {
  description: string;
  fileObjList: FileObj[] = [];

  constructor(private navCtrl: NavController, private fileService: FileService) {
  }

  save() {
    this.fileService.uploadMultiByFilePath(this.fileObjList).subscribe(res => {
      this.navCtrl.pop();
    });
  }


}

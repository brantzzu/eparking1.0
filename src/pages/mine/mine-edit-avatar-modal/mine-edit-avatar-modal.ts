import {Component} from '@angular/core';
import {Storage} from '@ionic/storage';
import {NavParams, ViewController} from 'ionic-angular';
import {NativeService} from '../../../providers/NativeService';
import {UserInfo} from "../../../model/UserInfo";
import {FileService} from "../../../providers/FileService";
import {FileObj} from "../../../model/FileObj";
import {FILE_SERVE_URL} from "../../../providers/Constants";

@Component({
  selector: 'page-mine-edit-avatar-modal',
  templateUrl: 'mine-edit-avatar-modal.html'
})
export class MineEditAvatarModalPage {
  isChange: boolean = false;//头像是否改变标识
  avatarPath: string;
  constructor(private params: NavParams,
              private viewCtrl: ViewController,
              private fileService: FileService,
              private nativeService: NativeService,
              private storage: Storage) {
    this.avatarPath = params.get('avatarPath');
  }

  getPicture(type) {//1拍照,0从图库选择
    let options = {
      targetWidth: 256,
      targetHeight: 256
    };
    if (type == 1) {
      this.nativeService.getPictureByCamera(options).subscribe(imageBase64 => {
        this.getPictureSuccess(imageBase64);
      });
    } else {
      this.nativeService.getPictureByPhotoLibrary(options).subscribe(imageBase64 => {
        this.getPictureSuccess(imageBase64);
      });
    }
  }

  private getPictureSuccess(imageBase64) {
    this.isChange = true;
    this.avatarPath =  imageBase64;
  }

  saveAvatar() {
    if (this.isChange) {
      let fileObj = <FileObj>{'base64': this.avatarPath};
      this.fileService.uploadByBase64(fileObj).subscribe(result => {// 上传图片到文件服务器
        if (result.success) {
          let origPath = FILE_SERVE_URL + result.data[0].origPath;
          this.storage.get('UserInfo').then((userInfo: UserInfo) => {
            userInfo.avatar = origPath;
            this.storage.set('UserInfo', userInfo);
          });
          this.viewCtrl.dismiss({avatarPath: origPath});
          //这里需要保存avatar字段到用户表
        }
      });
    } else {
      this.dismiss();
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}

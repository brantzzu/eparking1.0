import {Component, Input, Output, EventEmitter} from '@angular/core';
import {IonicPage, ActionSheetController, ModalController,AlertController} from 'ionic-angular';
import {FileObj} from "../../model/FileObj";
import {NativeService} from "../../providers/NativeService";
import {PreviewPicturePage} from "../preview-picture/preview-picture";

/**
 * Generated class for the SelectPicturePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-select-picture',
  templateUrl: 'select-picture.html',
})
export class SelectPicturePage {
  @Input() max: number = 4;  //最多可选择多少张图片，默认为4张

  @Input() destinationType: number = 1;  //期望返回的图片格式,默认1图片路径,0为返回图片base64

  @Input() allowAdd: boolean = true;  //是否允许新增

  @Input() allowDelete: boolean = true;  //是否允许删除

  @Input() fileObjList: FileObj[] = [];   //图片列表,与fileObjListChange形成双向数据绑定
  @Output() fileObjListChange = new EventEmitter<any>();

  constructor(private modalCtrl: ModalController,
              private alertCtrl: AlertController,
              private actionSheetCtrl: ActionSheetController,
              private nativeService: NativeService) {
  }

  addPicture() {//新增照片
    let that = this;
    that.actionSheetCtrl.create({
      buttons: [
        {
          text: '从相册选择',
          handler: () => {
            that.nativeService.getMultiplePicture({//从相册多选
              maximumImagesCount: (that.max - that.fileObjList.length),
              destinationType: this.destinationType
            }).subscribe(imgs => {
              for (let img of <string[]>imgs) {
                that.getPictureSuccess(img);
              }
            });
          }
        },
        {
          text: '拍照',
          handler: () => {
            that.nativeService.getPictureByCamera({
              destinationType: this.destinationType
            }).subscribe(img => {
              that.getPictureSuccess(img);
            });
          }
        },
        {
          text: '取消',
          role: 'cancel'
        }
      ]
    }).present();
  }

  deletePicture(i) {//删除照片
    if (!this.allowDelete) {
      return;
    }
    this.alertCtrl.create({
      title: '确认删除？',
      buttons: [{text: '取消'},
        {
          text: '确定',
          handler: () => {
            this.fileObjList.splice(i, 1);
          }
        }
      ]
    }).present();
  }

  viewerPicture(index) {//照片预览
    let picturePaths = [];
    for (let fileObj of this.fileObjList) {
      picturePaths.push(fileObj.origPath);
    }
    this.modalCtrl.create(PreviewPicturePage, {'initialSlide': index, 'picturePaths': picturePaths}).present();
  }

  private getPictureSuccess(img) {
    let fileObj = <FileObj>{'origPath': img, 'thumbPath': img};
    this.fileObjList.push(fileObj);
    this.fileObjListChange.emit(this.fileObjList);
  }

}

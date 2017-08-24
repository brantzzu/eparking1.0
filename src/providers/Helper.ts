
import { Injectable } from '@angular/core';
import { NativeService } from "./NativeService";
import { JPush } from "../../typings/modules/jpush/index";
import { Observable } from "rxjs";
import { DEFAULT_AVATAR, FILE_SERVE_URL } from "./Constants";
import { FileService } from "./FileService";
import { Result } from "../model/Result";
import { App } from 'ionic-angular';
import { MessagePage } from "../pages/message/message"
//import { ViewChild } from '@angular/core';
import { HttpService } from "../providers/HttpService";

/**
 * Helper类存放和业务有关的公共方法
 * @description
 */
@Injectable()
export class Helper {
  httpResponseData: any;

  constructor(
    public app: App,
    private jPush: JPush,
    private fileService: FileService,
    private httpService: HttpService,
    private nativeService: NativeService) {
  }



  /**
   * 获取用户头像路径
   * @param avatarId
   * @returns {any}
   */
  loadAvatarPath(avatarId) {
    return Observable.create(observer => {
      if (!avatarId) {
        observer.next(DEFAULT_AVATAR);
      } else {
        this.fileService.getFileInfoById(avatarId).subscribe((res: Result) => {
          if (res.success) {
            let avatarPath = FILE_SERVE_URL + res.data.origPath;
            observer.next(avatarPath);
          } else {
            observer.next(DEFAULT_AVATAR);
          }
        }, () => {
          observer.next(DEFAULT_AVATAR);
        })
      }
    });
  }

  initJpush() {
    if (!this.nativeService.isMobile()) {
      return;
    }
    this.jPush.init();
    if (this.nativeService.isIos()) {
      this.jPush.setDebugModeFromIos();
    } else {
      this.jPush.setDebugMode(true);
    }

    this.jPushAddEventListener();
  }

  private jPushAddEventListener() {
    this.jPush.getUserNotificationSettings().then(result => {
      if (result == 0) {
        console.log('系统设置中已关闭应用推送');
      } else if (result > 0) {
        console.log('系统设置中打开了应用推送');
      }
    });

    //点击通知进入应用程序时会触发的事件
    document.addEventListener("jpush.openNotification", event => {
      //  window['plugins'].jPushPlugin.resetBadge();
      let content = this.nativeService.isIos() ? event['aps'].alert : event['alert'];
      console.log("jpush.openNotification" + content);
      //this.navCtrl.push(MessagePage);
      this.app.getActiveNav().push(MessagePage);
    }, false);

    //收到通知时会触发该事件
    document.addEventListener("jpush.receiveNotification", event => {
      let content = this.nativeService.isIos() ? event['aps'].alert : event['alert'];
      let url = "http://quants.sufe.edu.cn/postMessage";
      let time = new Date();
      let param = { publicTime: time.toLocaleDateString(), messageContent: content };
      this.httpService.post(url, param).subscribe(result => {
        this.httpResponseData = result['_body'];
        if (this.httpResponseData == "postSuccess") {
          console.log("postMessageSuccess!");

        } else {
          console.log("postMessageFailed!");
        }

      }, error => {
        console.log(error);
      });
      console.log("jpush.receiveNotification:" + content);
    }, false);

    //收到自定义消息时触发这个事件
    document.addEventListener("jpush.receiveMessage", event => {
      let message = this.nativeService.isIos() ? event['content'] : event['message'];
      //Message save
      console.log("jpush.receiveMessage" + message);
    }, false);


    //设置标签/别名回调函数
    document.addEventListener("jpush.setTagsWithAlias", event => {
      console.log("onTagsWithAlias");
      let result = "result code:" + event['resultCode'] + " ";
      result += "tags:" + event['tags'] + " ";
      result += "alias:" + event['alias'] + " ";
      console.log(result);
    }, false);

  }

  //设置标签
  setTags() {
    if (!this.nativeService.isMobile()) {
      return;
    }
    let tags = [];
    if (this.nativeService.isAndroid()) {
      tags.push('android');
    }
    if (this.nativeService.isIos()) {
      tags.push('ios');
    }
    console.log('设置setTags:' + tags);
    this.jPush.setTags(tags);
  }

  //设置别名,一个用户只有一个别名
  setAlias(userId) {
    if (!this.nativeService.isMobile()) {
      return;
    }
    console.log('设置setAlias:' + userId);
    this.jPush.setAlias('' + userId);////ios设置setAlias有bug,值必须为string类型,不能是number
  }

  setTagsWithAlias(userId) {
    if (!this.nativeService.isMobile()) {
      return;
    }
    console.log('设置setTagsWithAlias:' + userId);
    this.jPush.setTagsWithAlias(['man', 'test'], '' + userId);
  }
}

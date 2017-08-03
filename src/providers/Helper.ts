/**
 * Created by yanxiaojun617@163.com on 12-27.
 */
import {Injectable} from '@angular/core';
import {Events} from "ionic-angular";
import {NativeService} from "./NativeService";
import {JPush} from "../../typings/modules/jpush/index";

/**
 * Helper类存放和业务有关的公共方法
 * @description
 */
@Injectable()
export class Helper {

  constructor(public events: Events,
              private jPush:JPush,
              private nativeService: NativeService) {
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
    this.jPush.getUserNotificationSettings().then(result=>{
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
    }, false);

    //收到通知时会触发该事件
    document.addEventListener("jpush.receiveNotification", event => {
      let content = this.nativeService.isIos() ? event['aps'].alert : event['alert'];
      console.log("jpush.receiveNotification" + content);
    }, false);

    //收到自定义消息时触发这个事件
    document.addEventListener("jpush.receiveMessage", event => {
      let message = this.nativeService.isIos() ? event['content'] : event['message'];
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
  public setTags() {
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
  public setAlias(userId) {
    if (!this.nativeService.isMobile()) {
      return;
    }
    console.log('设置setAlias:' + userId);
    this.jPush.setAlias('' + userId);////ios设置setAlias有bug,值必须为string类型,不能是number
  }

  public setTagsWithAlias(userId) {
    if (!this.nativeService.isMobile()) {
      return;
    }
    console.log('设置setTagsWithAlias:' + userId);
    this.jPush.setTagsWithAlias(['man', 'test'], '' + userId);
  }
}

import { Component } from '@angular/core';
import 'rxjs/add/operator/map';
import { NavController, Tabs } from 'ionic-angular';
import { JPush } from "../../../typings/modules/jpush/index";
import { NativeService } from '../../providers/NativeService';
import { HttpService } from '../../providers/HttpService';

declare var window;
@Component({
    selector: 'page-message',
    templateUrl: 'message.html',
})
export class MessagePage {
    tab: Tabs;
    msgList: Array<any> = [];

    constructor(
        private navCtrl: NavController,
        private jPush: JPush,
        private httpService: HttpService,
        private nativeService: NativeService
    ) {

    }

    ionViewWillEnter() {
        //this.msgList = [{ publicTime: '2017-07-09 12:05:38', messageContent: '倚泊智能停车正式上线啦!' }];
        this.msgList = [];
        this.httpService.get("http://quants.sufe.edu.cn/messages").map(res => {
            return res.json();
        }).subscribe((json: any) => {
            for (let i = 0; i < json.length; i++) {
                this.msgList.push(json[i]);
                console.log("json:");
                console.log(json[i]);
            }
        });
    }

}

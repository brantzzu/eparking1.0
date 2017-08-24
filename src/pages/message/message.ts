import { Component, ViewChild } from '@angular/core';
import 'rxjs/add/operator/map';
import { Slides, NavController, Tabs } from 'ionic-angular';
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

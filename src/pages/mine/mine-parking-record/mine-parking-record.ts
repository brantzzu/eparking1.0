import { Component } from '@angular/core';
import { ModalController, NavParams } from 'ionic-angular';
import { UserInfo } from "../../../model/UserInfo";
import { Helper } from "../../../providers/Helper";
import { HttpService } from "../../../providers/HttpService";
import { NativeService } from "../../../providers/NativeService";

@Component({
    selector: 'page-mine-parking-record ',
    templateUrl: 'mine-parking-record.html'
})
export class ParkingRecordPage {
    userInfo: UserInfo;
    data: any;
    apidata: any;
    noParkingRecord: boolean = false;


    constructor(private modalCtrl: ModalController,
        private params: NavParams,
        private httpService: HttpService,
        private nativeService: NativeService,
        private helper: Helper) {
        this.userInfo = params.get('userInfo');
    }
    ionViewWillEnter() {
        // this.data = [{ enterTime: '2015-07-09 12:05:38', leaveTime: '2015-07-09 12:05:38', parkingLot: '杨浦停车场', parkingFee: '35', payStatus: '已支付' },
        //  { enterTime: '2016-07-09 12:05:38', leaveTime: '2016-07-09 12:05:38', parkingLot: '四平路车场', parkingFee: '35', payStatus: '已支付' }];
        if (this.userInfo) {
            this.httpService.get("http://quants.sufe.edu.cn/parkingRecords", { userPhone: this.userInfo.phone }).map(res => {
                return res.json();
            }).subscribe((json: any) => {
                this.apidata = json;
                if (json.length < 1) {
                    this.noParkingRecord = true;
                }
            });

        } else {
            this.nativeService.showToast('获取用户信息失败，请重新登录！');
        }
        //console.log("apidata:" + this.apidata);
    }

}
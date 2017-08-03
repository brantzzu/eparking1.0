import { Injectable } from '@angular/core';
import { Response } from "@angular/http";
import 'rxjs/add/operator/map';
import { HttpService } from "../../providers/HttpService";
import { GlobalData } from "../../providers/GlobalData";

@Injectable()
export class MineService {
    constructor(public httpService: HttpService, private globalData: GlobalData) {
    }

    /**
     * 更新用户头像Id
     * @param avatarId
     * @returns {Observable<R>}
     */
    updateUserAvatarId(avatarId: string) {
        return this.httpService.post(`/user/avatar/${avatarId}`).map((res: Response) => res.json());
    }

    /**
     * 更改密码
     * @param oldPsw
     * @param newPsw
     * @returns {Observable<R>}
     */
    updateUserPassword(oldPsw: string, newPsw: string) {
        return this.httpService.post(`/user/modifyPassword/${this.globalData.userId}`, {
            'oldPsw': oldPsw,
            'newPsw': newPsw
        }).map((res: Response) => res.json());
    }


}

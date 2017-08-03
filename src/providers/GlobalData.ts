/**
 * Created by yanxiaojun on 2017/4/13.
 */
import {Injectable} from '@angular/core';

@Injectable()
export class GlobalData {

  private _userId: string;//用户id
  private _username: string;//用户名
  private _token: string;//token
  private _showLoading: boolean = true;//请求是否显示loading,注意:设置为true,当请求执行后需要设置为false


  get userId(): string {
    return this._userId;
  }

  set userId(value: string) {
    this._userId = value;
  }

  get username(): string {
    return this._username;
  }

  set username(value: string) {
    this._username = value;
  }

  get token(): string {
    return this._token;
  }

  set token(value: string) {
    this._token = value;
  }

  get showLoading(): boolean {
    return this._showLoading;
  }

  set showLoading(value: boolean) {
    this._showLoading = value;
  }
}

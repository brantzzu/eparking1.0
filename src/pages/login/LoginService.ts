import { Injectable } from '@angular/core';
import { HttpService } from "../../providers/HttpService";
import { Observable } from "rxjs";
import { Response } from "@angular/http";
import { UserInfo } from "../../model/UserInfo";
declare let hex_md5;

@Injectable()
export class LoginService {
  loginCheckResult: any;
  iSAuthenticate: boolean = false;
  // loginInfo: any;

  constructor(private httpService: HttpService) {
  }

  login(user): Observable<(UserInfo)> {
    let param = {
      'phone': user.phone,
      'password': user.password
    };
    return this.httpService.post('http://quants.sufe.edu.cn/authenticate', param).map((res: Response) => res.json());
    // this.httpService.post('http://quants.sufe.edu.cn/authenticate', param).subscribe(data => {
    //   this.loginCheckResult = JSON.parse(data['_body']);
    //   console.log(this.loginCheckResult.token);
    //   if (data['_body'] === null) {
    //     this.iSAuthenticate = false;
    //   } else {
    //     this.iSAuthenticate = true;
    //   }
    //   console.log("post");
    //   console.log(this.iSAuthenticate);
    // });
    // console.log("isAuthericate:");
    // console.log(this.iSAuthenticate);

    // if (this.iSAuthenticate) {
    //   console.log("if:");
    //   console.log(this.loginCheckResult.token);


    // } else {
    //   console.log("else:");

    //   let loginInfo = {
    //     access_token: '',
    //     user: {
    //       id: '',
    //       username: '',
    //       user: '',
    //       emali: '',
    //       phone: '',
    //       avatarId: '',
    //       description: ''
    //     }
    //   };
    //   return Observable.create((observer) => {
    //     observer.next(loginInfo);
    //   });

    // }
  }
}
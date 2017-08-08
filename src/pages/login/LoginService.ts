import { Injectable } from '@angular/core';
import { HttpService } from "../../providers/HttpService";
import { Observable } from "rxjs";
import { Response } from "@angular/http";
import { LoginInfo } from "../../model/UserInfo";
declare let hex_md5;

@Injectable()
export class LoginService {
  constructor(private httpService: HttpService) {
  }


  login(user): Observable<(LoginInfo)> {
    /* let param = {
     'client_id': 'app',
     'username': user.username,
     'password': hex_md5(user.password)
     };
     return this.httpService.post('/authenticate', param).map((res: Response) => res.json());*/
    let loginInfo = {
      access_token: 'test_test_test_test_test_test_test',
      user: {
        id: 1,
        username: user.username,
        name: 'Admin',
        email: 'Admin@eparking.com',
        phone: '13638000000',
        avatarId: '',
        description: '13638010000'
      }
    };
    return Observable.create((observer) => {
      observer.next(loginInfo);
    });
  }

}
import {Injectable} from '@angular/core';
import {HttpService} from "../../providers/HttpService";
import {Observable} from "rxjs";
import {UserInfo} from "../../model/UserInfo";

@Injectable()
export class LoginService {
  constructor(private httpService: HttpService) {
  }


  login(user): Observable<UserInfo> {
    // return this.httpService.post('/app/bugRepair/login', user).map((res: Response) =>  res.json());
    let userInfo = {
      id: 1,
      username: user.username,
      name: '小军',
      email: 'yanxiaojun617@163.com',
      phone: '18688498342',
      avatarId: '',
      description: '有图有真相，一本正经的胡说八道..'
    };
    return Observable.create((observer) => {
      observer.next(userInfo);
    });
  }

}

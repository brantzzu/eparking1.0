import {Component} from '@angular/core';
import 'rxjs/add/operator/map';
import {TestService} from "./TestService";
import {NativeService} from "../../providers/NativeService";
import {HttpService} from "../../providers/HttpService";
import {FileObj} from "../../model/FileObj";
import {FileService} from "../../providers/FileService";

@Component({
  selector: 'page-test',
  templateUrl: 'test.html',
})
export class TestPage {
  fileObjList: FileObj[] = [];

  constructor(private nativeService: NativeService,
              private httpService: HttpService,
              private fileService: FileService,
              public testService: TestService) {

  }


  getFileData() {
    this.testService.getFileData().subscribe(res => {
      this.fileObjList = res;
    });
  }

}

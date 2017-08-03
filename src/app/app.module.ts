import {NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicModule, IonicErrorHandler, Config} from 'ionic-angular';
import {IonicStorageModule} from '@ionic/storage';
import {MyApp} from './app.component';
import {TabModule} from "../pages/tabs/tab.module";
import {LoginModule} from '../pages/login/login.module';
import {HomeModule} from '../pages/home/home.module';
import {MineModule} from '../pages/mine/mine.module';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {AppVersion} from '@ionic-native/app-version';
import {Camera} from '@ionic-native/camera';
import {Toast} from '@ionic-native/toast';
import {File} from '@ionic-native/file';
import {Transfer} from '@ionic-native/transfer';
import {InAppBrowser} from '@ionic-native/in-app-browser';
import {ImagePicker} from '@ionic-native/image-picker';
import {Network} from '@ionic-native/network';
import {AppMinimize} from '@ionic-native/app-minimize';
import {JPush} from "../../typings/modules/jpush/index";

import {NativeService} from "../providers/NativeService";
import {HttpService} from "../providers/HttpService";
import {FileService} from "../providers/FileService";
import {Helper} from "../providers/Helper";
import {Utils} from "../providers/Utils";
import {TestModule} from "../pages/test/test.module";
import {HttpModule} from "@angular/http";
import {DemoModule} from "../pages/demo/demo.module";
import {GlobalData} from "../providers/GlobalData";
import {ModalFromRightEnter, ModalFromRightLeave, ModalScaleEnter, ModalScaleLeave} from "./modal-transitions";

@NgModule({
  declarations: [MyApp],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      mode: 'ios',//android是'md'
      backButtonText: ''
    }),
    IonicStorageModule.forRoot(),
    TabModule,
    LoginModule,
    HomeModule,
    DemoModule,
    MineModule,
    TestModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp],
  providers: [
    StatusBar,
    SplashScreen,
    AppVersion,
    Camera,
    Toast,
    File,
    Transfer,
    InAppBrowser,
    ImagePicker,
    Network,
    AppMinimize,
    JPush,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    NativeService,
    HttpService,
    FileService,
    Helper,
    Utils,
    GlobalData
  ]
})
export class AppModule {
  constructor(public config: Config) {
    this.setCustomTransitions();
  }

  private setCustomTransitions() {
    this.config.setTransition('modal-from-right-enter', ModalFromRightEnter);
    this.config.setTransition('modal-from-right-leave', ModalFromRightLeave);
    this.config.setTransition('modal-scale-enter', ModalScaleEnter);
    this.config.setTransition('modal-scale-leave', ModalScaleLeave);
  }
}

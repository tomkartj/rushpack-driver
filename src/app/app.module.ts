import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';
import { IonicStorageModule } from '@ionic/storage';

// Import the AF2 Module
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

// Import moment module
import { MomentModule } from 'angular2-moment';

// import services
import { DriverService } from '../services/driver-service';
import { ReportService } from '../services/report-service';
import { TransactionService } from '../services/transaction-service';
import { PlaceService } from "../services/place-service";
import { DealService } from "../services/deal-service";
import { TripService } from "../services/trip-service";
import { AuthService } from "../services/auth-service";
import { SettingService } from "../services/setting-service";
// end import services

// import pages
import { HomePage } from '../pages/home/home';
import { JobHistoryPage } from '../pages/job-history/job-history';
import { LoginPage } from '../pages/login/login';
import { PickUpPage } from '../pages/pick-up/pick-up';
import { ProfilePage } from '../pages/profile/profile';
import { RegisterPage } from '../pages/register/register';
import { WalletPage } from '../pages/wallet/wallet';
import { UserPage } from "../pages/user/user";
import { SettingPage } from "../pages/setting/setting";
// end import pages

// AF2 Settings
export const firebaseConfig = {
  apiKey: "AIzaSyAWdN4dKqpn-31Uip_YJvhyvyqITPQLX9A",
    authDomain: "rushpack1.firebaseapp.com",
    databaseURL: "https://rushpack1.firebaseio.com",
    projectId: "rushpack1",
    storageBucket: "rushpack1.appspot.com",
    messagingSenderId: "706481577375"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    JobHistoryPage,
    LoginPage,
    PickUpPage,
    ProfilePage,
    RegisterPage,
    WalletPage,
    UserPage,
    SettingPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    MomentModule,
    IonicModule.forRoot(MyApp,{
      mode: 'md'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    JobHistoryPage,
    LoginPage,
    PickUpPage,
    ProfilePage,
    RegisterPage,
    WalletPage,
    UserPage,
    SettingPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    DriverService,
    ReportService,
    TransactionService,
    PlaceService,
    DealService,
    TripService,
    AuthService,
    SettingService,
    /* import services */
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}

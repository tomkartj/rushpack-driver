import { Component } from '@angular/core';
import { NavController, ModalController, AlertController } from 'ionic-angular';

import { DriverService } from '../../services/driver-service';
import { DEAL_STATUS_PENDING, DEAL_TIMEOUT, POSITION_INTERVAL } from "../../services/constants";
import { DealService } from "../../services/deal-service";
import { AuthService } from "../../services/auth-service";
import { PlaceService } from "../../services/place-service";


import { PickUpPage } from "../pick-up/pick-up";
import { UserPage } from "../user/user";
import { WalletPage } from '../wallet/wallet';
import { JobHistoryPage } from '../job-history/job-history';

import { Geolocation } from '@ionic-native/geolocation';

declare var google: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  map: any;
  driver: any;
  deal: any;
  dealSubscription: any;
  isDriverAvailable: any = false;
  positionTracking: any;
  dealStatus: any = false;
  
  public job: any;
  public remainingTime = DEAL_TIMEOUT;
  

  constructor(public nav: NavController, public driverService: DriverService, public modalCtrl: ModalController,
              public alertCtrl: AlertController, public dealService: DealService, public authService: AuthService,
              public placeService: PlaceService, public geolocation: Geolocation) {    
  }
  loadMap(lat,lng){
    let latLng = new google.maps.LatLng(lat,lng);
    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: latLng,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      zoomControl: false,
      streetViewControl: false,
    });
    new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latLng,
      icon: './assets/img/pin.png'
    });
  }

  changeAvailability(){
    console.log(this.isDriverAvailable);
    if(this.isDriverAvailable === true){

            // get current location
            this.geolocation.getCurrentPosition().then((resp) => {
              let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
              let geocoder = new google.maps.Geocoder();
    
              this.loadMap(resp.coords.latitude,resp.coords.longitude);
              // find address from lat lng
              geocoder.geocode({'latLng': latLng}, (results, status) => {
                if (status == google.maps.GeocoderStatus.OK) {
                  // save locality
                  let locality = this.placeService.setLocalityFromGeocoder(results);
                  console.log('locality', locality);
                  this.watchDeals();
                  // start tracking
                  this.positionTracking = setInterval(() => {
                    // check for driver object, if it did not complete profile, stop updating location
                    if (!this.driver || !this.driver.type) {
                      return;
                    }
      
                    this.geolocation.getCurrentPosition().then((resp) => {
                      this.driverService.updatePosition(this.driver.$key, this.driver.type, locality, resp.coords.latitude,
                          resp.coords.longitude, this.driver.rating, this.driver.name);
                    }, err => {
                      console.log(err);
                    });
                  }, POSITION_INTERVAL);

                }
              });
            }, err => {
              console.log(err);
            });
      
    }
    else{
      console.log("cc")
      clearInterval(this.positionTracking);
      if (this.dealSubscription) {
        // unsubscribe when leave this page
        this.dealSubscription.unsubscribe();
      } 
    }
    
  }
  ionViewWillLeave() {
    if (this.dealSubscription) {
      // unsubscribe when leave this page
      this.dealSubscription.unsubscribe();
    }
  }

  // count down
  countDown() {
    let interval = setInterval(() => {
      this.remainingTime--;
      if (this.remainingTime == 0) {
        clearInterval(interval)
        this.cancelDeal();
        this.remainingTime = DEAL_TIMEOUT;
      }
    }, 1000);
  }

  cancelDeal(){
    console.log("close")
    this.dealStatus = false;
    this.dealService.removeDeal(this.driver.$key);
  }

  ionViewDidLoad(){
    this.driverService.getDriver().take(1).subscribe(snapshot => {
      this.driver = snapshot;
      
      if (!this.driver.plate && !this.driver.type) {
        this.nav.setRoot(UserPage, {
          user: this.authService.getUserData()
        });
      }
      
    });
  }

  // make array with range is n
  range(n) {
    return new Array(Math.round(n));
  }

  // confirm a job
  confirmJob() {
    console.log("confirm")
    let confirm = this.alertCtrl.create({
      title: 'Are you sure?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Disagree clicked');
            this.dealStatus = false;
            this.dealService.removeDeal(this.driver.$key);
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.dealStatus = false;
            this.dealService.acceptDeal(this.driver.$key, this.deal).then(() => {
              // go to pickup page
              this.nav.setRoot(PickUpPage);
            });
          }
        }
      ]
    });
    confirm.present();
  }

  // listen to deals
  watchDeals() {
    // listen to deals
    this.dealSubscription = this.dealService.getDeal(this.driver.$key).subscribe(snapshot => {
      this.deal = snapshot;
      if (snapshot.status == DEAL_STATUS_PENDING) {
        // if deal expired
        if (snapshot.createdAt < (Date.now() - DEAL_TIMEOUT * 1000)) {
          return this.dealService.removeDeal(this.driver.$key);
        }
        this.dealStatus = true;
        this.job = snapshot;

        this.geolocation.getCurrentPosition().then((resp) => {
          //resp.coords.longitude
          this.job.origin.distance = this.placeService.calcCrow(
              resp.coords.latitude,
              resp.coords.longitude,
              this.job.origin.location.lat,
              this.job.origin.location.lng).toFixed(0);
          this.job.destination.distance = this.placeService.calcCrow(
              resp.coords.latitude,
              resp.coords.longitude,
              this.job.destination.location.lat,
              this.job.destination.location.lng).toFixed(0);
        }, err => {
          console.log(err);
        });
        this.countDown();

      }
    });
  }

  goProfile(){
    this.nav.push(UserPage,{ user: this.authService.getUserData()});
  }

  goWallet(){
    this.nav.push(WalletPage);
  }
  goHistory(){
    this.nav.push(JobHistoryPage);
  }
}

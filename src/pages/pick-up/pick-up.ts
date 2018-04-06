import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { TripService } from "../../services/trip-service";
import { DealService } from "../../services/deal-service";
import { HomePage } from '../home/home';

/*
 Generated class for the PickUpPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-pick-up',
  templateUrl: 'pick-up.html'
})
export class PickUpPage {
  // trip info
  trip: any;
  passenger: any = {};
  isTripStarted = false;

  constructor(public nav: NavController, public tripService: TripService, public alertCtrl: AlertController,
    public dealService: DealService) {
    this.trip = tripService.getCurrentTrip();
    tripService.getPassenger(this.trip.passengerId).take(1).subscribe(snapshot => {
      this.passenger = snapshot;
    })
  }

  // pickup
  pickup() {
    this.isTripStarted = true;
    this.tripService.pickUp(this.trip.$key);
    // this.nav.setRoot(DropOffPage);
  }

  getDirection(lat,lng){
    console.log("call");
    let url = "https://www.google.com/maps/dir/?api=1&travelmode=driving&origin=Current Location&destination="+lat+","+lng;
    window.open(url);
  }

  showPayment() {
    let prompt = this.alertCtrl.create({
      title: 'Total (cash):',
      message: '<h1>' + this.trip.currency + this.trip.fee + '</h1>',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            // update this trip
            this.tripService.dropOff(this.trip.$key);
            // clear deal
            this.dealService.removeDeal(this.trip.driverId);
            // comeback to home page
            this.nav.setRoot(HomePage);
          }
        }
      ]
    });

    prompt.present();
  }
}

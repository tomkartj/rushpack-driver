import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { HomePage } from '../home/home'
import { AuthService } from "../../services/auth-service";
import * as firebase from 'firebase';

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  email: string = "";
  password: string = "";

  constructor(public nav: NavController, public authService: AuthService, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public toast: ToastController) {

  }

  // go to signup page
  signup() {
    this.nav.setRoot(RegisterPage);
  }

  // go to login page
  login() {
    if (!this.email || !this.password) {
      let alert = this.alertCtrl.create({
        message: 'Please provide email and password',
        buttons: ['OK']
      });
      return alert.present();
    }

    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

    this.authService.login(this.email, this.password).then(authData => {
      loading.dismiss();
      this.nav.setRoot(HomePage);
    }, error => {
      loading.dismiss();
      let alert = this.alertCtrl.create({
        message: error.message,
        buttons: ['OK']
      });
      alert.present();
    });
  }

  reset(){
    if(this.email){
      firebase.auth().sendPasswordResetEmail(this.email)
      .then( data =>
        this.toast.create({ message:'Please check your mail', duration: 3000}).present())
      .catch( err => this.toast.create({ message: err.message, duration: 3000}).present())
    }
  }
  
}
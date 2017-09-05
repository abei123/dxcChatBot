import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

import { HomePage } from '../home/home';
import { PatientModel } from '../../models/patient.model';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  //patientUrl : any = "http://52.163.246.246:8810/Patient";
  patientUrl : any = "/Patient";

  patientId : any;

  model: PatientModel = {
    id: '',
    name: '',
    gender: '',
    birthDate: ''
  };

  submitAttempt : boolean = false;
  loginValid : boolean = false;

  constructor(public navCtrl: NavController,
  public http: Http,
  public storage: Storage) {

  }

  ionViewDidLoad() {
    console.log('loginLoad');
  }

  login(){

    this.http.get(this.patientUrl + '?_format=json&identifier=' + this.patientId).map(res => res.json()).subscribe(data => {
        console.log(data);
        if(data.entry !== undefined){
          this.model.id = data.entry[0].resource.id;
          this.model.name = data.entry[0].resource.name[0].family + ' ' + data.entry[0].resource.name[0].given.toString();
          this.model.gender = data.entry[0].resource.gender;
          this.model.birthDate = data.entry[0].resource.birthDate;

          console.log(data.entry[0].resource.address[0]);

          this.storage.set('patientId', this.patientId);
          this.storage.set('patientName', this.model.name);
          this.submitAttempt = true;
          this.loginValid = true;

          this.navCtrl.push(HomePage);

        }else{
          this.submitAttempt = true;
          this.loginValid = false;
          this.storage.set('patientId', '');
        }
    }, error => {
      console.log(error);
    });
  }
}

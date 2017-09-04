import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

import { PatientModel } from '../../models/patient.model';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  patientId : any;
  model: PatientModel = {
    id: '',
    name: '',
    gender: '',
    birthDate: ''
  };
  avatarSrc : any = "http://placecorgi.com/300/300?index=random";
  patientUrl : any = "http://52.163.246.246:8810/Patient";
  //patientUrl : any = "/Patient";

  constructor(public navCtrl: NavController,
  public http: Http,
  public storage: Storage) {

  }

  private getPatient(patientId : any) {
    console.log(this.patientUrl + '?_format=json&identifier=' + patientId);
    this.http.get(this.patientUrl + '?_format=json&identifier=' + patientId).map(res => res.json()).subscribe(data => {
        console.log(data);
        if(data.entry !== undefined){
          this.model.id = data.entry[0].resource.id;
          this.model.name = data.entry[0].resource.name[0].family + ' ' + data.entry[0].resource.name[0].given.toString();
          this.model.gender = data.entry[0].resource.gender;
          this.model.birthDate = data.entry[0].resource.birthDate;
          this.avatarSrc = "http://placecorgi.com/300/300?index=random&" + Math.random() * 1000;
          console.log(data.entry[0].resource.address[0]);
        }else{

          this.model.id = 'NOT FOUND';
          this.model.name = '';
          this.model.gender = '';
          this.model.birthDate = '';
          this.avatarSrc = "assets/img/blank.jpg";
        }
    }, error => {
      console.log(error);
    });
  }

  ionViewDidLoad() {
    this.storage.get('patientId').then((val) => {
      this.patientId = val;

      this.getPatient(this.patientId);


    });
  }

  updatePatientID(){
    this.storage.set('patientId', this.patientId);

    this.getPatient(this.patientId);
  }


}

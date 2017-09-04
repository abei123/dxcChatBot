import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-chat2',
  templateUrl: 'chat2.html'
})
export class Chat2Page {
  messages : string[]  = new Array(); 
  message : string;

  constructor(public navCtrl: NavController) {

  }

  ionViewDidLoad() {
    console.log('Chat2Page');
  }

  sendMessage() {
    console.log(this.message);
    this.messages.push(this.message);
  }
}

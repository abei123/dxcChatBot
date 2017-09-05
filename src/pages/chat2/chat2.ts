import { Component, ViewChild } from '@angular/core';
import { NavController, Content } from 'ionic-angular';
import { Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-chat2',
  templateUrl: 'chat2.html'
})
export class Chat2Page {
  @ViewChild(Content) content: Content;

  messages : string[]  = new Array();
  message : string;
  conversionId : any;
  patientId : any;
  ws: any;
  finishedLoading : boolean = false;

  constructor(public navCtrl: NavController,public http: Http,
  public storage: Storage) {

  }

  postToChatBot(message : any) {
    let headers = new Headers();
    headers.append("Content-Type", 'application/json');
    headers.append("Authorization", 'Bearer ' + 'TViGZib394o.cwA.9gk.WG84I5TwVoWVXolXPn9D_P9jmt3dDydQzWmok8vmovY');

    let data = {
      "type": "message",
      "from": {
          "id": this.patientId
      },
      "text": message
    };

    this.http.post('https://directline.botframework.com/v3/directline/conversations/'+ this.conversionId +'/activities',data,{ headers: headers }).map(res => res.json()).subscribe(data => {
       console.log(data);
    }, error => {
      console.log(error);
    });
  }

  ionViewDidLoad() {
    console.log('Chat2Page');
    let headers = new Headers();
    headers.append("Content-Type", 'application/x-www-form-urlencoded');
    headers.append("Authorization", 'Bearer ' + 'TViGZib394o.cwA.9gk.WG84I5TwVoWVXolXPn9D_P9jmt3dDydQzWmok8vmovY');

    this.http.post('https://directline.botframework.com/v3/directline/conversations',null,{ headers: headers }).map(res => res.json()).subscribe(data => {
        console.log(data.conversationId);
        console.log(data.streamUrl);

        this.conversionId = data.conversationId;
        this.ws = new WebSocket(data.streamUrl);

        this.ws.onopen = () => {
            console.log('open');

            this.storage.get('patientName').then((val) => {

              this.messages.push('How may i help you, ' + val );

              this.storage.get('patientId').then((val) => {
                this.patientId = val;
                this.postToChatBot(val);

                this.finishedLoading = true;
              });
            });
        };

        this.ws.onmessage = (e) => {

          if (typeof e.data === 'string' && e.data.length > 0) {
              var data = JSON.parse(e.data);

              console.log(data);

              if(data.activities[0].from.id === this.patientId){
                return;
              }

              data.activities.forEach( activity => {
                if(activity.type === "endOfConversation"){
                  this.ionViewDidLoad();
                  return;
                }else if (activity.text) {
                    this.messages.push(activity.text);
                }else if (activity.attachments) {
                    activity.attachments.forEach( attachment => {
                        console.log(attachment);
                        switch (attachment.contentType) {
                            case "application/vnd.microsoft.card.hero":
                                if(attachment.content.buttons !== undefined){
                                  attachment.content.buttons.forEach( element => {
                                    this.messages.push('*' + element.value);
                                  });
                                }else{
                                  //this.renderHeroCard(attachment);
                                }
                                break;

                            case "image/png":
                                console.log('Opening the requested image ' + attachment.contentUrl);
                                open(attachment.contentUrl);
                                break;
                        }
                    });
                }
            });
          }
        };

        this.ws.onerror = () => {
            console.log('error occurred!');
        };

        this.ws.onclose = (e) => {
            console.log('close code=' + e.code);
        };
    }, error => {
      console.log(error);
    });
  }

  sendMessage() {
    if(!this.finishedLoading) {
      this.messages.push('Please wait, chat loading!');
      this.message = '';
      return;
    }
    this.storage.get('patientId').then((val) => {
      this.patientId = val;

      this.messages.push(this.message);

      this.postToChatBot(this.message);

      this.message = '';
      this.content.scrollToBottom();
    });
  }

  resetMessage() {
    this.postToChatBot('reset');

    this.messages = new Array();
    this.content.scrollToBottom();
  }
}

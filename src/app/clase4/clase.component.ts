import { Component, OnInit } from '@angular/core';

import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as mobilenet from '@tensorflow-models/mobilenet';


interface Classify {
  className: string;
  probability: number;
}

@Component({
  selector: 'app-clase',
  templateUrl: './clase.component.html',
  styleUrls: ['./clase.component.css']
})
export class ClaseComponent implements OnInit {


  public description: Classify[] = new (Array);
  public base64Img: string = '';
  private mobileNet?: mobilenet.MobileNet;
  private webcamElement?: HTMLVideoElement;
  private webcam?: any;



  async ngOnInit() {
    this.app();
    await this.initWebcam();
    this.classificationWhile()
  }






  public pause = true;
  private async classificationWhile() {
    while (true) {
      if (this.pause) {
        await new Promise(resolve => setTimeout(resolve, 500));
        continue;
      }
      // capture image
      const img = await this.webcam?.capture();
      this.description = await <any>this.mobileNet?.classify(img);
      img.dispose();
      await tf.nextFrame();
    }
  }


  private async initWebcam() {
    this.webcamElement = <any>document.getElementById('webcam');
    const wc = await tf.data.webcam(this.webcamElement);
    this.webcam = wc;
  }




  private async app() {
    this.mobileNet = await mobilenet.load();
  }

}

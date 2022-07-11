import { Component, OnInit } from '@angular/core';

import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as knn from '@tensorflow-models/knn-classifier';


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
  public DBElements:any = {
    '1': 'Elemento 1',
    '2': 'Elemento 2',
    '3': 'Elemento 3',
    '4': 'Elemento 4',
  }
  public description: Classify[] = new (Array);
  public base64Img: string = '';
  private mobileNet?: mobilenet.MobileNet;
  private webcamElement?: HTMLVideoElement;
  private webcam?: any;
  private classifier = knn.create();



  async ngOnInit() {
    await this.app();
    await this.initWebcam();
    this.classificationWhile()
  }






  public pause = true;
  private async classificationWhile() {
    while (true) {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (this.pause) {
        continue;
      }
      // capture image
      const img = await this.webcam?.capture();

      const enc = await this.customPrediction(img);
      // found custom image
      if (enc) {

      }
      // not found custom image
      if (!enc) {
        this.description = await <any>this.mobileNet?.classify(img);
      }

      // delete image
      img.dispose();
      await tf.nextFrame();
    }
  }


  private async customPrediction(img: any) {
    // find infer
    const activation = (<any>this.mobileNet).infer(img, "conv_preds");
    try {
      // compare infer by customs classifier
      const result2 = await this.classifier.predictClass(activation);
      let name = this.DBElements[result2.label]
      this.description = [{className:name,probability:1}]
      return true;
    } catch (err) {
      return false;
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





  /**
   * addExample
   */
  public async addExample(exampleID: number) {
    console.log('add example');
    const img = await this.webcam.capture();
    // create new infer
    const activation = this.mobileNet?.infer(img, true);
    this.classifier.addExample(<any>activation, exampleID);
    img.dispose();
  }
}




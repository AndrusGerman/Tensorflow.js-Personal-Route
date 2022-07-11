import { Component, OnInit } from '@angular/core';

import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';
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
  public base64Img:string = '';
  private mobileNet?: mobilenet.MobileNet;



  ngOnInit(): void {
    this.app()
  }


  /**
   * changeImg
   */
  public changeImg() {
    const file = (<any>document.getElementById('imgInput')).files[0];
    this.getBase64(file,(file) =>{
      this.base64Img = file;
    });
    // console.log((<any>document.getElementById('imgInput')).files[0]);

    // this.readImage((<any>document.getElementById('imgInput')).files[0])
  }






  private async app() {
    this.mobileNet = await mobilenet.load();
  }




  private getBase64(file: File, callbacks: (file: string) => void) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      callbacks(<string>reader.result);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }


  public onloadImg() {
    this.readImage(document.getElementById('img'))
  }


  private async readImage(file: any) {
    const imgResult = await this.mobileNet?.classify(file);
    this.description = <any>imgResult;
  }
}



//import * as tfCore from '@tensorflow/tfjs-core';
//import '@tensorflow/tfjs-backend-webgl';
//import '@tensorflow/tfjs-backend-wasm';

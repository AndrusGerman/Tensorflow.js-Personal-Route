import { Component, OnInit } from '@angular/core';

import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';

@Component({
  selector: 'app-clase',
  templateUrl: './clase.component.html',
  styleUrls: ['./clase.component.css']
})
export class ClaseComponent implements OnInit {

  ngOnInit(): void {
    this.run()
  }





  private async getData(): Promise<any[]> {
    const datosCasasR = await fetch('https://raw.githubusercontent.com/celismx/tensorflowjs.json/master/datos.json');

    const datosCasas = await datosCasasR.json();


    const datosLimpios = datosCasas.map((casa: any) => ({
      precio: casa.Precio,
      cuartos: casa.NumeroDeCuartosPromedio
    }))
      .filter((casa: any) => (casa.precio != null && casa.cuartos != null));
    return datosLimpios;
  }


  private model?: tf.Sequential;
  private inputNormalize?: tf.Tensor<tf.Rank>;
  private labelsNormalize?: tf.Tensor<tf.Rank>;
  private async run() {
    const data = await this.getData();
    this.viewData(data);
    this.model = this.createModel();
    const tensorData = this.convertDataToTensors(data);
    this.inputNormalize = tensorData.inputNormalize;
    this.labelsNormalize = tensorData.labelsNormalize;
  }


  /**
   * name
   */
  public training() {
    this.training_model(<any>(this.model), <any>(this.inputNormalize), <any>(this.labelsNormalize));
  }




  private viewData(data: any[]) {
    const valores = data.map(d => ({ x: d.cuartos, y: d.precio }));

    tfvis.render.scatterplot(
      { name: 'Rooms vs prices' },
      { values: valores },
      {
        xLabel: 'Rooms',
        yLabel: 'Prices',
        height: 300,
      }
    )
  }


  private createModel() {
    const model = tf.sequential();

    model.add(tf.layers.dense({ inputShape: [1], units: 1, useBias: true }))
    model.add(tf.layers.dense({ units: 1, useBias: true, }))
    return model;
  }


  private optimizer = tf.train.adam();
  private losses_func = tf.losses.meanSquaredError;
  private metric = ['mse'];


  public stopTraining = false;
  public isTraining = false;
  private async training_model(model: tf.Sequential, inputs: tf.Tensor<tf.Rank>, labels: tf.Tensor<tf.Rank>) {
    model.compile({
      optimizer: this.optimizer,
      loss: this.losses_func,
      metrics: this.metric,
    });
    this.isTraining = true;


    const surface = { name: 'show.history live', tab: 'Training' };
    const sizeBatch = 28; // number register in training
    const epoch = 5; // epoch = vueltas del modelo
    let history: any[] = [];


    await model.fit(inputs, labels, {
      epochs: epoch,
      batchSize: sizeBatch,
      shuffle: true,
      callbacks: {
        onEpochEnd: (epoch, log) => {
          history.push(log);
          tfvis.show.history(surface, history, ['loss', 'mse']);
          if (this.stopTraining) {
            (<any>(this.model)).stopTraining = true;
          }
        }
      }
    })
    this.isTraining = false;
    this.stopTraining = false;
  }


  private convertDataToTensors(data: any[]) {
    return tf.tidy(() => {
      tf.util.shuffle(data); // Data random mode


      const inputData = data.map((d: any) => d.cuartos);
      const labelsData = data.map((d: any) => d.precio);


      const tensorsInput = tf.tensor2d(inputData, [inputData.length, 1]);
      const tensorsLabels = tf.tensor2d(labelsData, [labelsData.length, 1]);


      const InputMax = tensorsInput.max();
      const InputMin = tensorsInput.min()

      const LabelsMax = tensorsLabels.max();
      const LabelsMin = tensorsLabels.min()



      // normalized data 0-1
      // (dato-min)/(max-min)

      const inputNormalize = tensorsInput.sub(InputMin).div(InputMax.sub(InputMin))
      const labelsNormalize = tensorsLabels.sub(LabelsMin).div(LabelsMax.sub(LabelsMin))

      return {
        inputNormalize,
        labelsNormalize,
        InputMax,
        InputMin,
        LabelsMax,
        LabelsMin,
      }
    })
  }




  /**
   * saveModel
   */
  public saveModel() {
    this.model?.save('downloads://myModelTraining')
  }

  /**
   * load_save_models
   */
  public async load_save_models() {
    const uploadJSONINPUT: HTMLInputElement = <any>(document.getElementById('upload-json'));
    const uploadWIGHTSINPUT: HTMLInputElement = <any>(document.getElementById('upload-wights'));


    if (!uploadJSONINPUT.files || !uploadWIGHTSINPUT.files) {
      console.log('One input contain black file');
      return;
    }

    await tf.loadLayersModel(tf.io.browserFiles([
      uploadJSONINPUT.files[0], uploadWIGHTSINPUT.files[0]
    ]));
    console.log('Model is load');
  }



  /**
   * viewInference
   */
  public async viewInference() {
    const data = await this.getData();
    const tensorData = this.convertDataToTensors(data);

    const { InputMax, InputMin, LabelsMax, LabelsMin } = tensorData;


    const [xs, preds] = tf.tidy(() => {
      const xs = tf.linspace(0, 1, 100);
      const preds = this.model?.predict(xs.reshape([100, 1]));

      // Inverte normalized
      const desnormX = xs.mul(InputMax.sub(InputMin)).add(InputMin);
      const desnormY = xs.mul(LabelsMax.sub(LabelsMin)).add(LabelsMin);
      return [desnormX.dataSync(), desnormY.dataSync()];

    });



    const pointsPrediction = Array.from(xs).map((val: any, i: number) => {
      return { x: val, y: preds[i] };
    })



    const originalPoints = data.map(d => ({ x: d.cuartos, y: d.precio }));



    tfvis.render.scatterplot({ name: 'Predicciones vs Originales' },
      { values: [originalPoints, pointsPrediction], series: ['originales', 'predicciones'] },
      {
        xLabel: 'Cuartos',
        yLabel: 'Precio',
        height: 300,
      })

  }
}



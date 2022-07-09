import { Component, OnInit } from '@angular/core';

import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';

@Component({
  selector: 'app-clase',
  templateUrl: './clase.component.html',
  styleUrls: ['./clase.component.css']
})
export class Clase1Component implements OnInit {

  ngOnInit(): void {
    this.run()
  }





  private async getData() {
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
  private async run() {
    const data = await this.getData();
    this.viewData(data);
    this.model = this.createModel();
    const tensorData = this.convertDataToTensors(data);
    const { inputNormalize, labelsNormalize } = tensorData;
    this.training_model(this.model, inputNormalize, labelsNormalize);
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


  private async training_model(model: tf.Sequential, inputs: tf.Tensor<tf.Rank>, labels: tf.Tensor<tf.Rank>) {
    model.compile({
      optimizer: this.optimizer,
      loss: this.losses_func,
      metrics: this.metric,
    });


    const surface = { name: 'show.history live', tab: 'Training' };
    const sizeBatch = 28; // number register in training
    const epoch = 5; // epoch = vueltas del modelo
    const history = [];


    return await model.fit(inputs, labels, {
      epochs: epoch,
      batchSize: sizeBatch,
      shuffle: true,
      callbacks: tfvis.show.fitCallbacks({ name: 'Training performace', },
        ['loss', 'mse'],// metricas de perdida | metricas de error estandar
        { height: 200, callbacks: ['onEpochEnd'] }
      )
    }
    
    
    )

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
}


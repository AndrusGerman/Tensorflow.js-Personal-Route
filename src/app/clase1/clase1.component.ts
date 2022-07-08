import { Component, OnInit } from '@angular/core';

import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';

@Component({
  selector: 'app-clase1',
  templateUrl: './clase1.component.html',
  styleUrls: ['./clase1.component.css']
})
export class Clase1Component implements OnInit {

  private NUM_NEURONAS_CAPA_OCULTA = 12;






  private datosEntrada = [[0, 0], [0, 1], [1, 0], [1, 1]];
  private datosEsperados = [[0], [1], [1], [0]];


  private ciclosDeAprendizaje = 0;



  // inicialización de tensores, pesos y bias (utilizamos los datos y los convertimos al formato esperado por TFjs)
  private tensorEntrada = tf.tensor2d(this.datosEntrada, [4, 2]);
  private tensorEsperado = tf.tensor2d(this.datosEsperados, [4, 1]);



  constructor() { }

  ngOnInit(): void {  }



  // las variables se registran en tensorflow como variables entrenables
  private pesosCapaUno = tf.variable(this.inicializaPesos([2, this.NUM_NEURONAS_CAPA_OCULTA], 2));
  private biasCapaUno = tf.variable(tf.scalar(0));
  private pesosCapaDos = tf.variable(this.inicializaPesos([this.NUM_NEURONAS_CAPA_OCULTA, 1], this.NUM_NEURONAS_CAPA_OCULTA));
  private biasCapaDos = tf.variable(tf.scalar(0));



  // inicialización aleatoria de los pesos
  private inicializaPesos(shape: number[], prevLayerSize: number) {
    return tf.randomNormal(shape).mul(tf.scalar(Math.sqrt(2.0 / prevLayerSize)));

  }


  // creamos la función de costo (aunque tf tambíen nos provee de varias)
  // aquí usamos minimos cuadrados
  calculaCosto(y: any, output: any) {
    return tf.squaredDifference(y, output).sum().sqrt();
  }



  private TASA_DE_APRENDIZAJE = 0.1;
  //stochastic gradient descent with alpha 0.1
  private optimizador: tf.SGDOptimizer = tf.train.sgd(this.TASA_DE_APRENDIZAJE);;

  async entrena(iteraciones: number) {
    const regresaCosto = true;
    let costo: any;
    for (let i = 0; i < iteraciones; i++) {

      costo = this.optimizador.minimize(() => {
        return <any>(this.calculaCosto(this.tensorEsperado, this.model(this.tensorEntrada)));
      }, regresaCosto);
      await tf.nextFrame();
      this.ciclosDeAprendizaje += 1;
      // if (i % 100 === 0) {
      //   let costods = costo.dataSync()
      //   console.log('Perdida[' + i + ']: ' + costods + '<br>');

      //   this.updateCiclosDeAprendizaje(this.ciclosDeAprendizaje);
      //   if (costods < 0.6 && this.noHeParadoAntes) {
      //     this.noHeParadoAntes = false;
      //     break;
      //   }
      // }
    }
    this.updateCiclosDeAprendizaje(this.ciclosDeAprendizaje);

    return costo.dataSync();
  }



  model(xs: tf.Tensor2D) {
    const hiddenLayer = tf.tidy(() => {
      // pesos, bias y función RELU (Rectified linear unit )
      return xs.matMul(this.pesosCapaUno).add(this.biasCapaUno).relu();
    });
    // pesos, bias y función Sigmoide
    let retmodel = hiddenLayer.matMul(this.pesosCapaDos).add(this.biasCapaDos).sigmoid();
    return retmodel;
  }




  updateCiclosDeAprendizaje(ciclos: number) {
    console.log("Ciclos de Aprendizaje: " + ciclos);

  }




  async pruebaXor() {
    var timeStart2 = 0
    var time2 = 0
    timeStart2 = performance.now();
    for (let i = 0; i < this.datosEntrada.length; i++) {

      const inputData = tf.tensor2d([this.datosEntrada[i]], [1, 2]);
      const expectedOutput = tf.tensor1d(this.datosEsperados[i]);
      const val = this.model(inputData);
      const myVal = await val.data()
      let strresult = "( " + this.datosEntrada[i][0] + " , " + this.datosEntrada[i][1] + " )-->" + await parseFloat(<any>(myVal)).toFixed(3) + " (esperado: " + this.datosEsperados[i] + ")<br>";
      console.log(strresult);

    }

    time2 = performance.now() - timeStart2;
    console.log('<br>Duración de la prueba : ' + time2.toFixed(3) + ' millisegundos</br><br>')
    console.log("<br>Error: " + this.calculaCosto(this.tensorEsperado, this.model(this.tensorEntrada)))



  }



  async aprendeXOR() {
    const timeStart = performance.now();
    const iteraciones = Math.floor(Math.random() * 200 + 400); // número aleatorio entre 400 y 600
    console.log('<br>Número de Iteraciones de entrenamiento (aleatorio): ' + iteraciones + '<br><br>');

    const loss = await this.entrena(iteraciones);
    const time = performance.now() - timeStart;




    let message = ''
    message += '<br>Perdida: ' + loss[0] + '<br><br>'
    message += 'Duración del entrenamiento : ' + Math.round(time / 1000).toFixed(2) + ' seconds</br><br>'

    console.log(message);

  }



}

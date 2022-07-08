import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Clase1Component } from './clase1.component';
import { RouterModule, Routes } from '@angular/router';


// Routes
const routes:Routes = [
  {component:Clase1Component,path:''}
]

@NgModule({
  imports:[RouterModule.forChild(routes)],
  exports:[RouterModule]
})
class Routing {}




// Module Main
@NgModule({
  declarations: [
    Clase1Component
  ],
  imports: [
    CommonModule,
    Routing,
  ]
})
export class Clase1Module { }

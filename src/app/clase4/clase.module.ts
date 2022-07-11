import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClaseComponent } from './clase.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';


// Routes
const routes: Routes = [
  { component: ClaseComponent, path: '' }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
class Routing { }


// Module Main
@NgModule({
  declarations: [
    ClaseComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    Routing,
  ]
})
export class ClaseModule { }

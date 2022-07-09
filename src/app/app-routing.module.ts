import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/1',
    pathMatch:'full'
  },
  {
    path: '1',
    loadChildren: () => import('./clase1/clase1.module').then(m => m.Clase1Module),
  },
  {
    path: '2',
    loadChildren: () => import('./clase2/clase.module').then(m => m.Clase2Module),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/1',
    pathMatch: 'full'
  },
  {
    path: '1',
    loadChildren: () => import('./clase1/clase1.module').then(m => m.ClaseModule),
  },
  {
    path: '2',
    loadChildren: () => import('./clase2/clase.module').then(m => m.ClaseModule),
  }
  ,
  {
    path: '3',
    loadChildren: () => import('./clase3/clase.module').then(m => m.ClaseModule),
  },
  {
    path: '4',
    loadChildren: () => import('./clase4/clase.module').then(m => m.ClaseModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

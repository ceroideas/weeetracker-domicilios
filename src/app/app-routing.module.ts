import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'busqueda-etiquetas',
    loadChildren: () => import('./pages/busqueda-etiquetas/busqueda-etiquetas.module').then( m => m.BusquedaEtiquetasPageModule)
  },
  {
    path: 'consulta-solicitud',
    loadChildren: () => import('./pages/consulta-solicitud/consulta-solicitud.module').then( m => m.ConsultaSolicitudPageModule)
  },
  {
    path: 'consulta-stock',
    loadChildren: () => import('./pages/consulta-stock/consulta-stock.module').then( m => m.ConsultaStockPageModule)
  },
  {
    path: 'detalle-etiqueta',
    loadChildren: () => import('./pages/detalle-etiqueta/detalle-etiqueta.module').then( m => m.DetalleEtiquetaPageModule)
  },
  {
    path: 'detalle-solicitud',
    loadChildren: () => import('./pages/detalle-solicitud/detalle-solicitud.module').then( m => m.DetalleSolicitudPageModule)
  },
  {
    path: 'entradas-salidas',
    loadChildren: () => import('./pages/entradas-salidas/entradas-salidas.module').then( m => m.EntradasSalidasPageModule)
  },
  // {
  //   path: 'firma',
  //   loadChildren: () => import('./pages/firma/firma.module').then( m => m.FirmaPageModule)
  // },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'identificacion-residuos',
    loadChildren: () => import('./pages/identificacion-residuos/identificacion-residuos.module').then( m => m.IdentificacionResiduosPageModule)
  },
  {
    path: 'nueva-solicitud',
    loadChildren: () => import('./pages/nueva-solicitud/nueva-solicitud.module').then( m => m.NuevaSolicitudPageModule)
  },
  {
    path: 'visor-img',
    loadChildren: () => import('./pages/visor-img/visor-img.module').then( m => m.VisorImgPageModule)
  },
  {
    path: 'stock-usuario',
    loadChildren: () => import('./pages/stock-usuario/stock-usuario.module').then( m => m.StockUsuarioPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { ConsultasService } from 'src/app/services/consultas.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario';

declare var moment:any;

@Component({
  selector: 'app-pesar-raees',
  templateUrl: './pesar-raees.page.html',
  styleUrls: ['./pesar-raees.page.scss'],
})
export class PesarRaeesPage implements OnInit {

  titulo: string = "Pesar RAEEs";
  usuario: Usuario = new Usuario();
  idCentro: any;
  idTercero: any;
  certificados:any = [];
  certificados_aux:any = [];

  detallePeso = null;
  detallePesoBtn = null;
  irPesar = false;

  pesoCertificado = 0;

  pesado;
  forcepesado = false;

  fracciones:any = [];

  pesoFraccion:any = [];

  blockedDays:any;

  filterDate = moment().format('Y-MM-DD');
  certificado;

  tipo = [];

  loaded = false;

  constructor(private _location: Location,
    private consultasService: ConsultasService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private nav: NavController,
    private usuarioService: UsuarioService) { this.cargarDatos();

  }

  async cargarDatos() {
    this.usuario = await this.usuarioService.cargarToken();
      this.idCentro =  this.usuario.dtercero;
      this.idTercero = this.usuario.tercero.PidTercero;

      this.blockedDays = (dateString: string) => {
        const date = new Date(dateString);
        const days = moment().subtract(this.usuario.direccionTercero.diasPesado,'days');
        const tomo = moment();

        /**
         * Date will be enabled if it is not
         * Sunday or Saturday
         */
        return date > days && date < tomo;
      };

      this.consultar();
      // this.cargarOperativas(this.idCentro, this.idTercero);
  }

  consultar()
  {
    this.certificados = [];
    this.consultasService.RaeesDia(moment().subtract(this.usuario.direccionTercero.diasPesado,'day').format('Y-MM-DD'),this.idCentro).subscribe((data:any)=>{
      console.log(data);
      this.pesado = data.i.dter.pesado;

      for (let j of data.i.certificados)
      {
        if (j.x && j.y) {
          console.log('tiene ambas, tiene peso');
          // j.x.peso = j.y.peso;
          // this.certificados.push(j.x);
        }else{
          console.log('no tiene peso')
          j.x.peso = 0;
          this.certificados.push(j.x);
        }
      }

      console.log(this.certificados);
      this.certificados_aux = this.certificados;

      this.enterFilter();

      if (localStorage.getItem('certificado_pesado')) {

        let i = this.certificados.findIndex(x=>x.pidCertificado == localStorage.getItem('certificado_pesado'));

        if (i != -1) {
          this.detallePeso = i;
          this.detallePesoBtn = true

          localStorage.removeItem('certificado_pesado');

          this.pesar();
        }
      }
    })
  }

  ngOnInit() {
  }

  filterByProperty(array, prop, value){
    var filtered = [];
    for(var i = 0; i < array.length; i++){

        var obj = array[i];

        for(var key in obj){
            if(typeof(obj[key] == "object")){
                var item = obj[key];
                if(item[prop] == value){
                    filtered.push(item);
                }
            }
        }

    }    

    return filtered;
  }

  pesar()
  {
    this.irPesar = true;
    this.forcepesado = false;
    this.loaded = false;

    // this.fracciones = this.certificados[this.detallePeso];
    // console.log(this.fracciones);

    this.pesoCertificado = this.certificados[this.detallePeso].peso;

    this.loadingCtrl.create().then(l=>{
      l.present();

      this.consultasService.GetRaeesFraccion(this.certificados[this.detallePeso].pidCertificado).subscribe((data:any)=>{
        
        let preaux = [];

        for (let j of data)
        {
          let aux = [];
          for(let k of j)
          {
            // console.log(k.x)
            if (k.x && k.y) {
              console.log('tiene ambas, tiene peso');
              k.x.peso = k.y.peso;
              aux.push(k.x);
            }else{
              console.log('no tiene peso')
              k.x.peso = 0;
              aux.push(k.x);
            }
            if (k.x.sidEstadoRaee == 5) {
              this.forcepesado = true;
            }
          }
          preaux.push(aux);
        }

        this.fracciones = preaux;
        this.loaded = true;

        for(let i in this.fracciones)
        {
          this.pesoFraccion[i] =
          {peso:this.fracciones[i][0].peso, fraccion:this.fracciones[i][0].sidFraccion, tercero: this.idTercero,
            certificadoSubordinado: "", direccion: this.idCentro,
            certificado: this.fracciones[i][0].sidCertificado, fecha: moment().format('Y-MM-DD')};
        }
        l.dismiss();
      })
    })
  }

  guardarPeso()
  {
    console.log(this.pesoFraccion);

    this.alertCtrl.create({message:"¿Guardar el peso del certificado?", buttons: [
      {text:"Si",
        handler:()=>{

          let pesoCertificado:any;

          if (this.pesado == 1 || this.forcepesado) {
            pesoCertificado =
            [{peso:this.pesoCertificado, fraccion:null, tercero: this.idTercero,
              certificadoSubordinado: "", direccion: this.idCentro,
              certificado: this.certificados[this.detallePeso].pidCertificado, fecha: moment().format('Y-MM-DD')}];

          }else if(this.pesado == 2 && !this.forcepesado){
            pesoCertificado = this.pesoFraccion;
          }

          for(let i of pesoCertificado)
          {
            if (i.peso == 0 || !i.peso) {
              return this.alertCtrl.create({message:"Coloque un peso correcto", buttons: ["OK"]}).then(a=>a.present());
            }
          }

          this.loadingCtrl.create().then(l=>{
            l.present();

            this.consultasService.guardarPeso(pesoCertificado).subscribe(data=>{
              l.dismiss();
              this.irPesar = false;

              this.certificados[this.detallePeso].peso = this.pesoCertificado;

              this.consultar();

              this.alertCtrl.create({message:"Se ha guardado el peso del certficado", buttons: ['Ok']}).then(a=>a.present());
              
            },err=>{
              l.dismiss();
            })
          })

        }
      },{
        text:"No"
      }
    ]}).then(a=>a.present());
  }

  atras() {
    this._location.back();
  }

  show = false;

  showCalendar()
  {
    if (this.show) {
      this.show = false;
    }else{
      this.show = true;
    }
  }

  enterFilter()
  {
    this.detallePesoBtn = false;
    this.detallePeso = null;

    let certificados = [];
    if (this.tipo.length) {
      for(let j of this.tipo)
      {
        let f = this.certificados_aux.filter(x=>x.pidCertificado.indexOf(j) != -1);

        for(let k of f){
          certificados.push(k);
        }
      }
    }else{
      certificados = this.certificados_aux;
    }

    this.show = false;

    this.certificados = certificados.filter(x=>
      (x.fecha.indexOf(this.filterDate) != -1 || !this.filterDate)
        && (x.pidCertificado.indexOf(this.certificado) != -1 || !this.certificado)
    );
  }

  addTipo()
  {
    setTimeout(()=>{
      let all = document.querySelectorAll('ion-checkbox[name="tipo"]');

      for(let i in all)
      {
        if ((all[i] as any).checked) {

          let idx = this.tipo.findIndex(x=>x==(all[i] as any).value);
          if (idx == -1) {
            this.tipo.push((all[i] as any).value);
          }
        }else{
          let idx = this.tipo.findIndex(x=>x==(all[i] as any).value);
          if (idx != -1) {
            this.tipo.splice(idx,1);
          }
        }
      }

      this.enterFilter();
    },10)
  }

}

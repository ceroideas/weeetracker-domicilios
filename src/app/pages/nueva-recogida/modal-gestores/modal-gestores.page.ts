import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EventsService } from '../../../services/events.service';

@Component({
  selector: 'app-modal-gestores',
  templateUrl: './modal-gestores.page.html',
  styleUrls: ['./modal-gestores.page.scss'],
})
export class ModalGestoresPage implements OnInit {

  @Input() centros:any;

  constructor(public modal: ModalController, private events: EventsService) { }

  ngOnInit() {
    this.centros = this.centros.sort((a, b) => a.nombre.localeCompare(b.nombre));
    // console.log(this.centros);
  }

  select(c)
  {
    console.log('find',c);

    this.events.publish('sendToSearch',c.pidTercero);
    this.modal.dismiss();
  }

}

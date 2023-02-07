import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EventsService } from '../../../services/events.service';

@Component({
  selector: 'app-modal-origenes',
  templateUrl: './modal-origenes.page.html',
  styleUrls: ['./modal-origenes.page.scss'],
})
export class ModalOrigenesPage implements OnInit {

  @Input() origenes:any;

  constructor(public modal: ModalController, private events: EventsService) { }

  ngOnInit() {
    this.origenes = this.origenes.sort((a, b) => a.nombre.localeCompare(b.nombre));
    // console.log(this.origenes);
  }

  select(c)
  {
    console.log('find',c);

    this.events.publish('changeOrigin',c);
    this.modal.dismiss();
  }

}

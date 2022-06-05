import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-visor-img',
  templateUrl: './visor-img.page.html',
  styleUrls: ['./visor-img.page.scss'],
})
export class VisorImgPage implements OnInit {

  @Input() value : string;

  constructor() { }

  ngOnInit() {
  }

}

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NuevaReutilizacionEntregaPage } from './nueva-reutilizacion-entrega.page';

describe('NuevaReutilizacionEntregaPage', () => {
  let component: NuevaReutilizacionEntregaPage;
  let fixture: ComponentFixture<NuevaReutilizacionEntregaPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevaReutilizacionEntregaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NuevaReutilizacionEntregaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NuevaReutilizacionEntregaDirectaPage } from './nueva-reutilizacion-entrega-directa.page';

describe('NuevaReutilizacionEntregaDirectaPage', () => {
  let component: NuevaReutilizacionEntregaDirectaPage;
  let fixture: ComponentFixture<NuevaReutilizacionEntregaDirectaPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevaReutilizacionEntregaDirectaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NuevaReutilizacionEntregaDirectaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

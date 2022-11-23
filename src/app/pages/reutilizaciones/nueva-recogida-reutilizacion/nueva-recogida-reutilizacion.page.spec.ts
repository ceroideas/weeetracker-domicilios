import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NuevaRecogidaReutilizacionPage } from './nueva-recogida-reutilizacion.page';

describe('NuevaRecogidaReutilizacionPage', () => {
  let component: NuevaRecogidaReutilizacionPage;
  let fixture: ComponentFixture<NuevaRecogidaReutilizacionPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevaRecogidaReutilizacionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NuevaRecogidaReutilizacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReutilizacionesRealizadasPage } from './reutilizaciones-realizadas.page';

describe('ReutilizacionesRealizadasPage', () => {
  let component: ReutilizacionesRealizadasPage;
  let fixture: ComponentFixture<ReutilizacionesRealizadasPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReutilizacionesRealizadasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReutilizacionesRealizadasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

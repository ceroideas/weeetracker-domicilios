import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NuevaEntregaDirectaPage } from './nueva-entrega-directa.page';

describe('NuevaEntregaDirectaPage', () => {
  let component: NuevaEntregaDirectaPage;
  let fixture: ComponentFixture<NuevaEntregaDirectaPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevaEntregaDirectaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NuevaEntregaDirectaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

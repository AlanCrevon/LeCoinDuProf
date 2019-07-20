import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ModalTosPage } from './modal-tos.page';

describe('ModalTosPage', () => {
  let component: ModalTosPage;
  let fixture: ComponentFixture<ModalTosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule],
      declarations: [ModalTosPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalTosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

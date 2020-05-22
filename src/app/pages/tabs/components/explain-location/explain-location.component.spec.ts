import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplainLocationComponent } from './explain-location.component';
import { ModalController } from '@ionic/angular';

describe('ExplainLocationComponent', () => {
  let component: ExplainLocationComponent;
  let fixture: ComponentFixture<ExplainLocationComponent>;

  const ModalControllerStub = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExplainLocationComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: ModalController, useValue: ModalControllerStub }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplainLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

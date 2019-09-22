import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxPage } from './box.page';

describe('BoxPage', () => {
  let component: BoxPage;
  let fixture: ComponentFixture<BoxPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BoxPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

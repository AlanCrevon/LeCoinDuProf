import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxesPage } from './boxes.page';

describe('BoxesPage', () => {
  let component: BoxesPage;
  let fixture: ComponentFixture<BoxesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BoxesPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

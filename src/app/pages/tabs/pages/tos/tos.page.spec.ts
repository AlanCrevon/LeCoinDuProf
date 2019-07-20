import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TosPage } from './tos.page';

describe('TosPage', () => {
  let component: TosPage;
  let fixture: ComponentFixture<TosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TosPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

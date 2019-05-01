import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WantedPage } from './wanted.page';

describe('WantedPage', () => {
  let component: WantedPage;
  let fixture: ComponentFixture<WantedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WantedPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WantedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeratePage } from './moderate.page';

describe('ModeratePage', () => {
  let component: ModeratePage;
  let fixture: ComponentFixture<ModeratePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModeratePage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModeratePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

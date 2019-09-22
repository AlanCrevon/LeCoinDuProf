import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplainLocationComponent } from './explain-location.component';

describe('ExplainLocationComponent', () => {
  let component: ExplainLocationComponent;
  let fixture: ComponentFixture<ExplainLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExplainLocationComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
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

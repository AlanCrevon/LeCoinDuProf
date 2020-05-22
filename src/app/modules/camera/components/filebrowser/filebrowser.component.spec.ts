import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilebrowserComponent } from './filebrowser.component';
import { IonicModule } from '@ionic/angular';

describe('FilebrowserComponent', () => {
  let component: FilebrowserComponent;
  let fixture: ComponentFixture<FilebrowserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilebrowserComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [IonicModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilebrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

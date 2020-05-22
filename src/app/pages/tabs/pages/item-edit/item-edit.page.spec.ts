import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ItemEditPage } from './item-edit.page';

describe('ItemEditPage', () => {
  let component: ItemEditPage;
  let fixture: ComponentFixture<ItemEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemEditPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ItemEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

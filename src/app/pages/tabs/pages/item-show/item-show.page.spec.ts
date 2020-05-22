import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ItemShowPage } from './item-show.page';

describe('ItemShowPage', () => {
  let component: ItemShowPage;
  let fixture: ComponentFixture<ItemShowPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemShowPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ItemShowPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

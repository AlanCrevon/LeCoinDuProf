import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';
import { Item } from 'src/app/types/item';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ModalController, AlertController } from '@ionic/angular';
import { ItemEditComponent } from '../../components/item-edit/item-edit.component';
import { Box } from 'src/app/types/box';
import { FirestorageService } from 'src/app/modules/upload/services/firestorage.service';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-item-edit',
  templateUrl: './item-edit.page.html',
  styleUrls: ['./item-edit.page.scss']
})
export class ItemEditPage implements OnInit {
  item$: Observable<Item>;
  box$: Observable<Box>;
  itemId: string;
  boxId: string;

  constructor(
    private route: ActivatedRoute,
    private dbService: DbService,
    private router: Router,
    public modalController: ModalController,
    private firestorageService: FirestorageService,
    public categoriesService: CategoriesService
  ) {}

  ngOnInit() {
    this.itemId = this.route.snapshot.paramMap.get('itemId');
    this.boxId = this.route.snapshot.paramMap.get('boxId');

    this.item$ = this.dbService.getDocument<Item>(`/items/${this.itemId}`).pipe(
      catchError(error => {
        this.router.navigateByUrl(`/app/boxes/${this.boxId}`);
        return of(undefined);
      }),
      map(item => {
        if (item.hasPicture === true) {
          item.picture$ = this.firestorageService.download(`/users/${item.owner}/${item.id}/item`);
          item.thumbnail$ = this.firestorageService.download(`/users/${item.owner}/${item.id}/thumbnail`);
        }
        return item;
      })
    );

    this.box$ = this.dbService.getDocument<Box>(`/boxes/${this.boxId}`).pipe(
      catchError(error => {
        this.router.navigateByUrl(`/app/boxes/${this.boxId}`);
        return of(undefined);
      })
    );
  }

  async openItemEditor(item: Item, box: Box) {
    const modal = await this.modalController.create({
      component: ItemEditComponent,
      componentProps: {
        item,
        box
      }
    });
    modal.present();
  }
}

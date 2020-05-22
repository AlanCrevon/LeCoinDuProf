import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';
import { Box } from 'src/app/types/box';
import { ModalController } from '@ionic/angular';
import { BoxEditComponent } from '../../components/box-edit/box-edit.component';
import { Observable, Subscription, of } from 'rxjs';
import { Item } from 'src/app/types/item';
import { map, catchError } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { ToastService } from 'src/app/services/toast.service';
import { ItemEditComponent } from '../../components/item-edit/item-edit.component';
import { FirestorageService } from 'src/app/modules/upload/services/firestorage.service';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-box',
  templateUrl: './box.page.html',
  styleUrls: ['./box.page.scss']
})
export class BoxPage implements OnInit {
  box$: Observable<Box>;
  items$: Observable<Item[]>;
  displayNoitemMessage = false;

  constructor(
    private route: ActivatedRoute,
    private dbService: DbService,
    private router: Router,
    private modalController: ModalController,
    private toastService: ToastService,
    private firestorageService: FirestorageService,
    public categoriesService: CategoriesService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    const boxId = this.route.snapshot.paramMap.get('boxId');
    this.box$ = this.dbService.getDocument<Box>(`/boxes/${boxId}`).pipe(
      catchError(error => {
        this.toastService.error(`Erreur lors du chargement de la boite`);
        this.router.navigateByUrl('/app/boxes');
        return of(undefined);
      })
    );
    this.items$ = this.dbService
      .getCollection<Item>('items', ref => ref.where('box', '==', boxId).orderBy('name', 'asc'))
      .pipe(
        catchError(error => {
          return of([]);
        }),
        map((items: Item[]) =>
          items.map(item => {
            if (item.hasPicture === true) {
              item.picture$ = this.firestorageService.download(`/users/${item.owner}/${item.id}/item`);
              item.thumbnail$ = this.firestorageService.download(`/users/${item.owner}/${item.id}/thumbnail`);
            }
            return item;
          })
        )
      );
  }

  async edit(box: Box) {
    const modal = await this.modalController.create({
      component: BoxEditComponent,
      componentProps: {
        box
      }
    });
    modal.present();
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

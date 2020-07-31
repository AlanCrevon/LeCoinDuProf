import { Component, OnInit } from '@angular/core';
import { Observable, of, merge, concat, forkJoin, ReplaySubject } from 'rxjs';
import { Item } from 'src/app/types/item';
import { DbService } from 'src/app/services/db.service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { FirestorageService } from 'src/app/modules/upload/services/firestorage.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { ModalController } from '@ionic/angular';
import { ItemSearchComponent } from '../../components/item-search/item-search.component';
import { FieldValue } from '@google-cloud/firestore';
import { firestore } from 'firebase/app';

@Component({
  selector: 'app-shared',
  templateUrl: './shared.page.html',
  styleUrls: ['./shared.page.scss']
})
export class SharedPage implements OnInit {
  itemsSubject: ReplaySubject<Item[]> = new ReplaySubject<Item[]>();
  items$: Observable<Item[]>;
  endReached = false;
  loadingMore = false;
  filters;
  itemsPerPage = 12;
  itemsDisplayedWereCreatedBefore: Date;
  thereAreNewerItems = false;

  constructor(
    private dbService: DbService,
    private firestorageService: FirestorageService,
    public categoriesService: CategoriesService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.items$ = this.itemsSubject.asObservable();
    this.loadSharedItems().subscribe(items => {
      this.itemsSubject.next(items);
      this.listenForNewerItems(this.itemsDisplayedWereCreatedBefore).subscribe(newerItems => {
        this.thereAreNewerItems = newerItems.length > 0;
      });
    });
  }

  listenForNewerItems(newerThan: Date) {
    return this.dbService
      .getCollection<Item>('items', (ref: any) => {
        ref = ref.where('isShared', '==', true).limit(this.itemsPerPage);

        if (!!this.filters) {
          if (!!this.filters.geohash) {
            const geohash = this.filters.geohash.substring(0, this.filters.radius);
            const text = geohash;
            const end = text.replace(/.$/, (c: string) => String.fromCharCode(c.charCodeAt(0) + 1));
            ref = ref
              .where('geohash', '>=', text)
              .where('geohash', '<', end)
              .orderBy('geohash', 'asc');
          }
          if (!!this.filters.category) {
            ref = ref.where('category', '==', this.filters.category);
          }
        }

        ref = ref.orderBy('createdAt', 'desc').endBefore(newerThan);

        return ref;
      })
      .pipe(
        catchError(error => {
          console.log(error);
          return of([] as Item[]);
        }),
        map(items => {
          // If page is incomplete, we reached the end of collection
          if (items.length < this.itemsPerPage) {
            this.endReached = true;
          }
          return items.map(item => {
            if (item.hasPicture === true) {
              // Patch data with observable img
              item.picture$ = this.firestorageService.download(`/users/${item.owner}/${item.id}/item`);
            }
            return item;
          });
        })
      );
  }

  loadSharedItems(latestCreation?: FieldValue | Date): Observable<Item[]> {
    if (!!!latestCreation) {
      latestCreation = new Date();
      this.itemsDisplayedWereCreatedBefore = latestCreation;
    }

    return this.dbService
      .getCollection<Item>('items', (ref: any) => {
        ref = ref.where('isShared', '==', true).limit(this.itemsPerPage);

        if (!!this.filters) {
          if (!!this.filters.geohash) {
            const geohash = this.filters.geohash.substring(0, this.filters.radius);
            const text = geohash;
            const end = text.replace(/.$/, (c: string) => String.fromCharCode(c.charCodeAt(0) + 1));
            ref = ref
              .where('geohash', '>=', text)
              .where('geohash', '<', end)
              .orderBy('geohash', 'asc');
          }
          if (!!this.filters.category) {
            ref = ref.where('category', '==', this.filters.category);
          }
        }

        // Note : if you have a where filter with an inequality
        // (<, <=, >, or >=) on field 'geohash' and so you must also use
        // 'geohash' as your first Query.orderBy()
        ref = ref.orderBy('createdAt', 'desc').startAfter(latestCreation);
        return ref;
      })
      .pipe(
        catchError(error => {
          console.log(error);
          return of([] as Item[]);
        }),
        map(items => {
          // If page is incomplete, we reached the end of collection
          if (items.length < this.itemsPerPage) {
            this.endReached = true;
          }
          return items.map(item => {
            if (item.hasPicture === true) {
              // Patch data with observable img
              item.picture$ = this.firestorageService.download(`/users/${item.owner}/${item.id}/item`);
            }
            return item;
          });
        })
      );
  }

  loadMore(event) {
    if (this.endReached || this.loadingMore) {
      event.target.complete();
      return;
    }

    this.loadingMore = true;

    this.items$ = this.items$.pipe(
      switchMap(displayedItems => {
        return this.loadSharedItems(displayedItems[displayedItems.length - 1].createdAt).pipe(
          map(newItems => {
            // Remove loading message
            event.target.complete();

            // Re enable loading more
            this.loadingMore = false;

            // If page is incomplete, we reached the end of collection
            if (newItems.length < this.itemsPerPage) {
              this.endReached = true;
            }
            return displayedItems.concat(newItems);
          })
        );
      })
    );
  }

  doRefresh(event?) {
    // Re enable pagination
    this.endReached = false;
    // Restart from start
    this.thereAreNewerItems = false;

    this.loadSharedItems().subscribe(items => {
      if (!!event) {
        // Remove loading message
        event.target.complete();
      }

      // Restart items from scratch
      this.itemsSubject.next(items);
    });
  }

  async openSearchModal(filters: any) {
    const modal = await this.modalController.create({
      component: ItemSearchComponent,
      componentProps: {
        filters
      }
    });
    modal.onDidDismiss().then(result => {
      if (!!result.data) {
        this.filters = result.data;
        this.doRefresh();
      }
    });
    modal.present();
  }
}

import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Item } from 'src/app/types/item';
import { ActivatedRoute, Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';
import { catchError, map, take } from 'rxjs/operators';
import { FirestorageService } from 'src/app/modules/upload/services/firestorage.service';
import { AppUser } from 'src/app/types/app-user';
import { Chat } from 'src/app/types/chat';
import { AuthService } from 'src/app/services/auth.service';
import { firestore, User } from 'firebase/app';
import { ToastService } from 'src/app/services/toast.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { ModalController } from '@ionic/angular';
import { ReportCreateComponent } from '../../components/report-create/report-create.component';

@Component({
  selector: 'app-item-show',
  templateUrl: './item-show.page.html',
  styleUrls: ['./item-show.page.scss']
})
export class ItemShowPage implements OnInit {
  item$: Observable<Item>;
  profilePicture = '/assets/img/undraw_profile_pic_ic5t.svg';

  constructor(
    private route: ActivatedRoute,
    private dbService: DbService,
    private router: Router,
    private firestorageService: FirestorageService,
    private authService: AuthService,
    private toastService: ToastService,
    public categoriesService: CategoriesService,
    private modalController: ModalController
  ) {}

  /**
   * Load item
   */
  ngOnInit() {
    const itemId = this.route.snapshot.paramMap.get('itemId');

    this.item$ = this.dbService.getDocument<Item>(`/items/${itemId}`).pipe(
      catchError(error => {
        this.router.navigateByUrl(`/app/shared`);
        return of(undefined);
      }),
      map(item => {
        if (item.hasPicture === true) {
          item.picture$ = this.firestorageService.download(`/users/${item.owner}/${item.id}/item`);
          item.thumbnail$ = this.firestorageService.download(`/users/${item.owner}/${item.id}/thumbnail`);
        }
        item.owner$ = this.dbService.getDocument<AppUser>(`/users/${item.owner}`).pipe(
          map(appUser => {
            // Load user's profile picture
            if (appUser.hasPicture) {
              this.firestorageService
                .download('users/' + item.owner + '/profile')
                .pipe(catchError(error => '/assets/img/undraw_profile_pic_ic5t.svg'))
                .subscribe(url => {
                  this.profilePicture = url;
                });
            }
            return appUser;
          })
        );
        return item;
      })
    );
  }

  /**
   * Try to open existing chat about this item between current user and
   * item's owner
   * If the chat doesn't exist yet, fallback to create it
   * @param item Item about which to start
   */
  openChat(item: Item): void {
    this.authService.appUser$.subscribe(appUser => {
      // User can't start a chat whith themselves
      if (appUser.id === item.owner) {
        this.toastService.error(`🤪 Vous ne pouvez pas ouvrir une conversation avec vous même`);
        return;
      }

      // Find existing chat
      this.dbService
        .getCollection<Chat>('/chats', ref =>
          ref.where('item', '==', item.id).where('participants', 'array-contains', appUser.id)
        )
        .pipe(
          catchError(error => {
            return of([] as Chat[]);
          }),
          take(1)
        )
        .subscribe(chats => {
          if (chats.length > 0) {
            // Chat is found: redirect to chat
            this.router.navigateByUrl(`/app/chats/${chats[0].id}`);
          } else {
            // Chat doesn't exist: create it
            this.createChat(item, appUser);
          }
        });
    });
  }

  createChat(item: Item, appUser: AppUser) {
    const chat: Chat = {
      participants: [item.owner, appUser.id],
      item: item.id,
      lastMessage: '',
      createdAt: firestore.FieldValue.serverTimestamp(),
      modifiedAt: firestore.FieldValue.serverTimestamp()
    };
    this.dbService.addDocument<Chat>(`/chats`, chat).then(created => {
      this.router.navigateByUrl(`/app/chats/${created.id}`);
    });
  }

  async report(item: Item) {
    const modal = await this.modalController.create({
      component: ReportCreateComponent,
      componentProps: {
        item
      }
    });
    modal.present();
  }
}

import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Chat } from 'src/app/types/chat';
import { AuthService } from 'src/app/services/auth.service';
import { switchMap, catchError, map } from 'rxjs/operators';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss']
})
export class ChatsPage implements OnInit {
  chats$: Observable<Chat[]>;
  constructor(public dbService: DbService, public authService: AuthService) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.chats$ = this.loadChats();
  }

  loadChats(): Observable<Chat[]> {
    return this.authService.user$.pipe(
      switchMap(user =>
        this.dbService
          .getCollection<Chat>('/chats', ref =>
            ref
              .where('participants', 'array-contains', user.uid)
              .orderBy('modifiedAt', 'desc')
              .limit(30)
          )
          .pipe(
            catchError(error => {
              return of([] as Chat[]);
            }),
            map(chats =>
              chats.map(chat => {
                chat.item$ = this.dbService.getDocument(`/items/${chat.item}`);
                return chat;
              })
            )
          )
      )
    );
  }
}

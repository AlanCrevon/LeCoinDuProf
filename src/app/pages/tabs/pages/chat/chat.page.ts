import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Chat } from 'src/app/types/chat';
import { ActivatedRoute, Router } from '@angular/router';
import { AppUser } from 'src/app/types/app-user';
import { DbService } from 'src/app/services/db.service';
import { catchError, take, map } from 'rxjs/operators';
import { ToastService } from 'src/app/services/toast.service';
import { Item } from 'src/app/types/item';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { firestore } from 'firebase/app';
import { FirestorageService } from 'src/app/modules/upload/services/firestorage.service';
import { Message } from 'src/app/types/message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss']
})
export class ChatPage implements OnInit {
  chat$: Observable<Chat>;
  item$: Observable<Item>;
  with$: Observable<AppUser>;
  messages$: Observable<Message[]>;

  appUser: AppUser;

  messageForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private dbService: DbService,
    private toastService: ToastService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private firestorageService: FirestorageService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    const chatId = this.route.snapshot.paramMap.get('chatId');
    this.chat$ = this.loadChat(chatId);

    this.messages$ = this.loadMessages(chatId);

    this.authService.appUser$.subscribe(appUser => {
      this.appUser = appUser;
      this.messageForm = this.buildMessageForm(appUser);

      this.chat$.subscribe(chat => {
        // Load other paricipant's profile
        const participant = chat.participants.filter(id => id !== appUser.id)[0];
        this.with$ = this.loadAppUser(participant);

        // Load item
        this.item$ = this.loadItem(chat.item);
      });
    });
  }

  loadChat(chatId: string): Observable<Chat> {
    return this.dbService.getDocument<Chat>(`/chats/${chatId}`).pipe(
      take(1),
      catchError(error => {
        this.toastService.error(`💬 Erreur lors du chargement de la conversation`);
        this.router.navigateByUrl('/app/chats');
        return of(undefined);
      })
    );
  }

  loadItem(itemId: string): Observable<Item> {
    const defaultItem: Item = {
      name: undefined,
      owner: undefined,
      box: undefined,
      description: undefined,
      category: undefined,
      isShared: undefined,
      modifiedAt: undefined,
      createdAt: undefined,
      formatted_address: undefined,
      coordinates: undefined,
      geohash: undefined,
      canGive: undefined,
      canLend: undefined,
      canExchange: undefined,
      canSend: undefined,
      hasPicture: undefined
    };
    return this.dbService.getDocument<Item>(`/items/${itemId}`).pipe(
      take(1),
      catchError(error => {
        return of(defaultItem);
      })
    );
  }

  loadAppUser(appUserId: string): Observable<AppUser> {
    const defaultAppUser: AppUser = {
      bio: undefined,
      formatted_address: undefined,
      coordinates: undefined,
      geohash: undefined,
      createdAt: undefined,
      displayName: undefined,
      hasPicture: undefined
    };
    if (!!!appUserId) {
      return of(defaultAppUser);
    }
    return this.dbService.getDocument<AppUser>(`/users/${appUserId}`).pipe(
      take(1),
      catchError(error => {
        return of(defaultAppUser);
      })
    );
  }

  loadMessages(chatId: string): Observable<Message[]> {
    return this.dbService
      .getCollection<Message>(`/chats/${chatId}/messages`, ref => ref.orderBy('createdAt', 'desc').limit(30))
      .pipe(
        catchError(error => {
          console.log(error);
          return of([] as Message[]);
        }),
        map(messages =>
          messages.sort((a: any, b: any) => {
            if (!!!a.createdAt || !!!b.createdAt) {
              return 1;
            }
            return a.createdAt.toDate() > b.createdAt.toDate() ? 1 : -1;
          })
        )
      );
  }

  buildMessageForm(appUser: AppUser): FormGroup {
    return this.formBuilder.group({
      content: ['', Validators.required],
      author: [appUser.id, Validators.required],
      createdAt: [firestore.FieldValue.serverTimestamp(), Validators.required]
    });
  }

  sendMessage(chatId: Chat, form: FormGroup): void {
    this.dbService.addDocument<Message>(`/chats/${chatId}/messages`, form.value).then(() =>
      form.reset({
        content: '',
        author: this.appUser.id,
        createdAt: firestore.FieldValue.serverTimestamp()
      })
    );
  }
}

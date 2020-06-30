import { Component, OnInit } from '@angular/core';
import { firestore } from 'firebase/app';
import { Box } from 'src/app/types/box';
import { DbService } from 'src/app/services/db.service';
import { AuthService } from 'src/app/services/auth.service';
import { Observable, of } from 'rxjs';
import { AppUser } from 'src/app/types/app-user';
import { Router } from '@angular/router';
import { switchMap, catchError } from 'rxjs/operators';
import { ToastService } from 'src/app/services/toast.service';
import { ModalController } from '@ionic/angular';
import { BoxEditComponent } from '../../components/box-edit/box-edit.component';

@Component({
  selector: 'app-boxes',
  templateUrl: './boxes.page.html',
  styleUrls: ['./boxes.page.scss']
})
export class BoxesPage implements OnInit {
  boxes$: Observable<Box[]>;

  constructor(
    private dbService: DbService,
    public authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.boxes$ = this.loadBoxes();
  }

  loadBoxes(): Observable<Box[]> {
    return this.authService.appUser$.pipe(
      switchMap(appUser =>
        this.dbService
          .getCollection<Box>('/boxes', ref => ref.where('owner', '==', appUser.id).orderBy('name', 'asc'))
          .pipe(
            catchError(error => {
              return of([] as Box[]);
            })
          )
      )
    );
  }

  async openBoxEditor(appUser: AppUser) {
    const modal = await this.modalController.create({
      component: BoxEditComponent,
      componentProps: {
        appUser
      }
    });
    modal.present();
  }

  async createBox(appUser: AppUser) {
    const randomBoxNumber = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
    const box: Box = {
      name: `Boite ${randomBoxNumber}`,
      owner: appUser.id,
      createdAt: firestore.FieldValue.serverTimestamp(),
      modifiedAt: firestore.FieldValue.serverTimestamp(),
      coordinates: appUser.coordinates,
      formatted_address: appUser.formatted_address,
      geohash: appUser.geohash
    };
    this.dbService
      .addDocument('/boxes', box)
      // .then(documentRef => this.router.navigateByUrl(`/app/boxes/${documentRef.id}`))
      .catch(reason => this.toastService.error('Erreur lors de la création de la boite'));
  }
}

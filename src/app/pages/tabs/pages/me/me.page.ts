import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DbService } from 'src/app/services/db.service';
import { ToastService } from 'src/app/services/toast.service';
import { AppUser } from 'src/app/types/app-user';
import { Observable, from } from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { CameraService } from 'src/app/modules/camera/services/camera.service';
import { FirestorageService } from 'src/app/modules/upload/services/firestorage.service';
import { IonInput, ModalController } from '@ionic/angular';
import { GeocodingService } from 'src/app/services/geocoding.service';
import { ExplainLocationComponent } from '../../components/explain-location/explain-location.component';
import { take } from 'rxjs/operators';
import { MessagingService } from 'src/app/services/messaging.service';
import { FcmToken } from 'src/app/types/fcm-token';

@Component({
  selector: 'app-me',
  templateUrl: './me.page.html',
  styleUrls: ['./me.page.scss']
})
export class MePage implements OnInit {
  user: firebase.User;
  appUserForm: FormGroup;
  fcmTokens$: Observable<FcmToken[]>;

  currentProfilePicture: string;
  profilePicture: string;
  profileThumbnail: string;
  isNotificationActivatedHere: string;
  hasToDeleteProfilePicture = false;

  @ViewChild('searchRef', { read: ElementRef, static: false }) searchElementRef: ElementRef;
  @ViewChild('searchRef', { static: false }) search: IonInput;

  constructor(
    public authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private dbService: DbService,
    private cameraService: CameraService,
    public firestorageService: FirestorageService,
    private geocodingService: GeocodingService,
    private modalController: ModalController,
    public messagingService: MessagingService
  ) {}

  /**
   * Component initialisation
   */
  ngOnInit() {
    this.authService.user$.subscribe(user => (this.user = user));

    this.authService.appUser$.subscribe(appUser => {
      // Build the user's form
      this.appUserForm = this.buildAppUserForm(appUser);

      // Load user's profile picture
      if (appUser.hasPicture) {
        this.firestorageService.download('users/' + appUser.id + '/profile').subscribe(url => {
          this.currentProfilePicture = url;
        });
      }

      // Initialize google map geocoding search input
      this.initGeocodingSearch();

      // Load user's FCM tokens
      this.fcmTokens$ = this.dbService.getCollection<FcmToken>(`/users/${appUser.id}/tokens`);
    });
  }

  /**
   * Initilize google map geocoding search input
   */
  initGeocodingSearch() {
    // Here we need to give the view time to load.
    if (!!!this.searchElementRef || !!!this.searchElementRef.nativeElement.getElementsByTagName('input')[0]) {
      setTimeout(() => this.initGeocodingSearch(), 100);
      return;
    }
    const inputField = this.searchElementRef.nativeElement.getElementsByTagName('input')[0];
    this.geocodingService.getLongLat(inputField).then(location => {
      this.appUserForm.get('formatted_address').setValue(location.formatted_address);
      this.appUserForm.get('coordinates').setValue(location.coordinates);
      this.appUserForm.get('geohash').setValue(location.geohash);
    });
  }

  /**
   * Log the user out
   */
  logout() {
    this.authService.logout().subscribe(() => {
      this.toastService.success('Au revoir et à bientôt 👋 !');
      this.router.navigateByUrl('/');
    });
  }

  /**
   * Build the reactive form for the user to update their public profile
   * @param user user's profile
   */
  buildAppUserForm(appUser: AppUser): FormGroup {
    return this.formBuilder.group({
      displayName: [appUser.displayName, Validators.required],
      bio: [appUser.bio, Validators.required],
      formatted_address: [appUser.formatted_address, Validators.required],
      coordinates: [appUser.coordinates, Validators.required],
      geohash: [appUser.geohash, Validators.required],
      modifiedAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdAt: appUser.createdAt || firebase.firestore.FieldValue.serverTimestamp(),
      hasPicture: [!!appUser.hasPicture ? appUser.hasPicture : false]
    });
  }

  async save() {
    this.dbService
      .setDocument(`/users/${this.user.uid}`, this.appUserForm.value)
      .then(async () => {
        // Upload profile picture
        if (!!this.profilePicture) {
          await this.firestorageService.uploadImage(
            `users/${this.user.uid}/profile`,
            this.profilePicture,
            'Image de profile'
          );
        }
        // Upload thumbnail profile picture
        if (!!this.profileThumbnail) {
          await this.firestorageService.uploadImage(
            `users/${this.user.uid}/thumbnail`,
            this.profileThumbnail,
            `Miniature de l'image de profile`
          );
        }
        // Delete picture if required
        if (!!this.hasToDeleteProfilePicture) {
          await this.firestorageService.delete(`users/${this.user.uid}/thumbnail`);
          await this.firestorageService.delete(`users/${this.user.uid}/profile`);
        }
        // Update profile to tag the user as having a profile picture
        if (!!this.profilePicture || !!this.profileThumbnail) {
          await this.dbService.updateDocument(`/users/${this.user.uid}`, {
            modifiedAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        }
        this.toastService.success(`🙂 Votre profile a été mis à jour`);
      })
      .catch(error => {
        console.log(error);
        this.toastService.error(`😒 Erreur durant la mise à jour de votre profile.`);
      });
  }

  /**
   * Truncate domain from email adress
   */
  removeMailExtension(email: string): string {
    return email.substring(0, email.lastIndexOf('@'));
  }

  async selectImage() {
    this.cameraService
      .selectImage()
      .pipe(take(1))
      .subscribe(data => {
        this.currentProfilePicture = !!data ? this.currentProfilePicture : undefined;
        this.profilePicture = !!data ? data.picture : undefined;
        this.profileThumbnail = !!data ? data.thumbnail : undefined;
        this.hasToDeleteProfilePicture = !!!data;
        this.appUserForm.get('hasPicture').setValue(!!data);
      });
  }

  async openExplainLocationModal() {
    const modal = await this.modalController.create({
      component: ExplainLocationComponent
    });
    modal.present();
  }

  async checkUserExists(uid): Promise<boolean> {
    const user = await this.dbService
      .getDocument<AppUser>(`/users/${this.user.uid}`)
      .pipe(take(1))
      .toPromise();
    return !!user.createdAt;
  }
}

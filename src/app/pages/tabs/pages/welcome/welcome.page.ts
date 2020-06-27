import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CameraService } from 'src/app/modules/camera/services/camera.service';
import { IonSlides, IonInput, ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { GeocodingService } from 'src/app/services/geocoding.service';
import { ExplainLocationComponent } from '../../components/explain-location/explain-location.component';
import { DbService } from 'src/app/services/db.service';
import * as firebase from 'firebase';
import { FirestorageService } from 'src/app/modules/upload/services/firestorage.service';
import { AppUser } from 'src/app/types/app-user';
import { MessagingService } from 'src/app/services/messaging.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss']
})
export class WelcomePage implements OnInit {
  appUser: AppUser;
  appUserForm: FormGroup;
  currentProfilePicture: string;
  profilePicture: string;
  profileThumbnail: string;
  hasToDeleteProfilePicture = false;
  index = 1;

  @ViewChild('sliderRef', { static: true }) slider: IonSlides;
  @ViewChild('usernameRef') username: IonInput;
  @ViewChild('searchRef', { read: ElementRef }) searchElementRef: ElementRef;
  @ViewChild('searchRef') search: IonInput;

  slideOpts = {
    pagination: false
  };

  constructor(
    private authService: AuthService,
    private cameraService: CameraService,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private router: Router,
    private geocodingService: GeocodingService,
    private modalController: ModalController,
    private dbService: DbService,
    private firestorageService: FirestorageService,
    public messagingService: MessagingService
  ) {}

  ngOnInit() {
    // Fetch user from authService
    this.authService.appUser$.pipe(take(1)).subscribe(appUser => {
      this.appUser = appUser;

      // Build appUser's form
      this.appUserForm = this.buildAppUserForm(appUser);

      // Load user's profile
      this.firestorageService.download('users/' + appUser.id + '/profile').subscribe(url => {
        this.currentProfilePicture = url;
      });
    });

    // Disable swipe gestures to change slide
    this.slider.lockSwipes(true);

    // On slide change
    this.slider.ionSlideDidChange.subscribe(() => {
      this.slider.getActiveIndex().then(index => {
        // Update slide index
        this.index = index + 1;

        // On slide 3 : auto focus to username input
        if (this.index === 3) {
          this.username.setFocus();
        }

        // On slide 4
        if (this.index === 4) {
          setTimeout(() => {
            // Init geocoding on search field
            this.geocodingService
              .getLongLat(this.searchElementRef.nativeElement.getElementsByTagName('input')[0])
              .then(location => {
                this.appUserForm.get('formatted_address').setValue(location.formatted_address);
                this.appUserForm.get('coordinates').setValue(location.coordinates);
                this.appUserForm.get('geohash').setValue(location.geohash);
              });
            // Auto focus to search input
            this.search.setFocus();
          }, 100);
        }
      });
    });
  }

  next() {
    this.slider.lockSwipes(false);
    this.slider.slideNext();
    this.slider.lockSwipes(true);
  }

  previous() {
    this.slider.lockSwipes(false);
    this.slider.slidePrev();
    this.slider.lockSwipes(true);
  }

  async save() {
    this.dbService
      .setDocument(`/users/${this.appUser.id}`, this.appUserForm.value)
      .then(async () => {
        // Upload profile picture
        if (!!this.profilePicture) {
          await this.firestorageService.uploadImage(
            `users/${this.appUser.id}/profile`,
            this.profilePicture,
            'Image de profile'
          );
        }
        // Upload thumbnail profile picture
        if (!!this.profileThumbnail) {
          await this.firestorageService.uploadImage(
            `users/${this.appUser.id}/thumbnail`,
            this.profileThumbnail,
            `Miniature de l'image de profile`
          );
        }
        // Delete picture if required
        if (!!this.hasToDeleteProfilePicture) {
          await this.firestorageService.delete(`users/${this.appUser.id}/thumbnail`);
          await this.firestorageService.delete(`users/${this.appUser.id}/profile`);
        }
        // Update profile to tag the user as having a profile picture
        if (!!this.profilePicture || !!this.profileThumbnail) {
          await this.dbService.updateDocument(`/users/${this.appUser.id}`, {
            modifiedAt: firebase.firestore.FieldValue.serverTimestamp()
          });
          this.next();
        } else {
          this.next();
        }
      })
      .catch(error => {
        this.toastService.error('Erreur durant la création de votre profile.');
      });
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

  buildAppUserForm(appUser: AppUser): FormGroup {
    return this.formBuilder.group({
      displayName: [!!appUser.displayName ? appUser.displayName : undefined, Validators.required],
      bio: [!!appUser.bio ? appUser.bio : undefined, Validators.required],
      formatted_address: [!!appUser.formatted_address ? appUser.formatted_address : undefined],
      coordinates: [!!appUser.coordinates ? appUser.coordinates : undefined],
      geohash: [!!appUser.geohash ? appUser.geohash : undefined],
      createdAt: !!appUser.createdAt ? appUser.createdAt : firebase.firestore.FieldValue.serverTimestamp(),
      modifiedAt: firebase.firestore.FieldValue.serverTimestamp(),
      hasPicture: [!!appUser.hasPicture ? appUser.hasPicture : false]
    });
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.toastService.success('👋 Au revoir et à bientôt !');
      this.router.navigateByUrl('/');
    });
  }

  async openExplainLocationModal() {
    const modal = await this.modalController.create({
      component: ExplainLocationComponent
    });
    modal.present();
  }
}

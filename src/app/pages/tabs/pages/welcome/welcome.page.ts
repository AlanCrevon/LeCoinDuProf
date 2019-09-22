import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'firebase';
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

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss']
})
export class WelcomePage implements OnInit {
  user: User;
  appUserForm: FormGroup;
  profilePicture: string;
  profileThumbnail: string;
  index = 1;

  @ViewChild('sliderRef') slider: IonSlides;
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
    private firestorageService: FirestorageService
  ) {}

  ngOnInit() {
    // Fetch user from authService
    this.authService.user$.pipe(take(1)).subscribe(async user => {
      this.user = user;
      this.appUserForm = this.buildAppUserForm(user);
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

        // On slide 4 : auto focus to search input & reset location
        if (this.index === 4) {
          this.search.setFocus();
          this.appUserForm.get('formatted_address').setValue(undefined);
          this.appUserForm.get('position').setValue(undefined);
        }
      });
    });
  }

  ionViewDidEnter() {
    // Init geocoding on search field
    this.geocodingService
      .getLongLat(this.searchElementRef.nativeElement.getElementsByTagName('input')[0])
      .then(location => {
        this.appUserForm.get('formatted_address').setValue(location.formatted_address);
        this.appUserForm.get('position').setValue(location.point.data);
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
        // Update profile to tag the user as having a profile picture
        if (!!this.profilePicture || !!this.profileThumbnail) {
          await this.dbService.updateDocument(`/users/${this.user.uid}`, {
            hasProfilePicture: true,
            modifiedAt: firebase.firestore.FieldValue.serverTimestamp()
          });
          this.next();
        } else {
          this.next();
        }
      })
      .catch(error => {
        console.log(error);
        this.toastService.error('Erreur durant la création de votre profile.');
      });
  }

  async selectImage() {
    this.cameraService.selectImage().subscribe(data => {
      this.profilePicture = data.picture;
      this.profileThumbnail = data.thumbnail;
    });
  }

  buildAppUserForm(user: User): FormGroup {
    return this.formBuilder.group({
      displayName: [user.displayName, Validators.required],
      formatted_address: undefined,
      position: undefined,
      hasProfilePicture: false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      modifiedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.toastService.success('Au revoir et à bientôt 👋 !');
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

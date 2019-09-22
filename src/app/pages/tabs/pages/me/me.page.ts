import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'firebase';
import { AuthService } from 'src/app/services/auth.service';
import { DbService } from 'src/app/services/db.service';
import { ToastService } from 'src/app/services/toast.service';
import { AppUser } from 'src/app/types/app-user';
import { Observable } from 'rxjs';
import { Settings } from 'src/app/types/settings';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-me',
  templateUrl: './me.page.html',
  styleUrls: ['./me.page.scss']
})
export class MePage implements OnInit {
  /** User's account */
  user: User;

  /** Form for the user to change their public profile */
  userForm: FormGroup;

  /** Form for the user to change their private settings */
  settingsForm: FormGroup;

  /** User's public profile  */
  appUser: Observable<AppUser>;

  /**  User's private settings */
  settings: Observable<Settings>;

  constructor(
    public authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private dbService: DbService,
    private mapsAPILoader: MapsAPILoader
  ) {}

  /**
   * Component initialisation
   */
  ngOnInit() {
    // Subscribe to identified user
    this.authService.user$.subscribe(user => {
      // Required to handle user's logout
      if (!!!user) {
        return;
      }

      // Store current user
      this.user = user;

      // Load user's profile
      this.appUser = this.dbService.getDocument<AppUser>(`/users/${user.uid}`);
      this.appUser.subscribe(appUser => {
        if (!!!appUser) {
          // If it's user's first visit. We create their profile
          const newAppUser: AppUser = {
            displayName: user.displayName || this.removeMailExtension(user.email),
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            location: undefined
          };
          this.dbService.setDocument(`/users/${user.uid}`, newAppUser);
        } else {
          // Else we use this profile to populate the form
          this.userForm = this.buildUserForm(appUser);
        }
      });

      // Load user's settings
      this.settings = this.dbService.getDocument<Settings>(`/settings/${user.uid}`);
      this.settings.subscribe(settings => {
        if (!!!settings) {
          // If it's user's first visit, we set their account's email as default notification mail address
          const newSettings: Settings = {
            email: user.email
          };
          this.dbService.setDocument(`/settings/${user.uid}`, newSettings);
        } else {
          // Else we use their settings to populate the form
          this.settingsForm = this.buildSettingsForm(settings);
        }
      });
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
  buildUserForm(user: User | AppUser): FormGroup {
    return this.formBuilder.group({
      displayName: [user.displayName, Validators.required]
    });
  }

  /**
   * Build the reactive form for the user to update their private settings
   * @param settings user's settings
   */
  buildSettingsForm(settings: Settings): FormGroup {
    return this.formBuilder.group({
      email: [settings.email, Validators.email]
    });
  }

  /**
   * Save user's profile's settings
   * @param user user's account
   * @param userForm user's public profile
   * @param settingsForm user's private settings
   */
  save(user: User, userForm: FormGroup, settingsForm: FormGroup) {
    this.dbService
      .updateDocument(`/users/${user.uid}`, userForm.value)
      .then(() => this.dbService.updateDocument(`/settings/${user.uid}`, settingsForm.value))
      .finally(() => this.toastService.success('Votre profile est mis à jour'))
      .catch(error => {
        this.toastService.error(`Erreur durant la sauvegarde du profile`);
      });
  }

  /**
   * Truncate domain from email adress
   */
  removeMailExtension(email: string): string {
    return email.substring(0, email.lastIndexOf('@'));
  }
}

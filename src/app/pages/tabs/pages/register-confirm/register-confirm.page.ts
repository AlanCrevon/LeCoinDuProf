import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'firebase/app';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-register-confirm',
  templateUrl: './register-confirm.page.html',
  styleUrls: ['./register-confirm.page.scss']
})
export class RegisterConfirmPage implements OnInit {
  constructor(public authService: AuthService, private toastService: ToastService, private router: Router) {}

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      // If user has verified mail, redirect to profile page
      if (user.emailVerified) {
        this.router.navigateByUrl('/app/me');
        return;
      }
      // Else : send validation mail
      this.sendEmailVerification(user);
    });

    // Redirect user when email is validated
    this.authService.refreshUserUntilEmailVerified().subscribe(
      () => this.router.navigateByUrl('/app/me'),
      error => this.toastService.error('Impossible de valider votre email')
    );
  }

  /**
   * Send a mail to validate mail adress
   * @param user the user to send the mail to
   */
  sendEmailVerification(user: User) {
    this.authService.sendEmailVerification(user).subscribe(
      () => {},
      error => this.toastService.error(error.code)
    );
  }
}

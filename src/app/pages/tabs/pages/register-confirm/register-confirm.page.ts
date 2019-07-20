import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'firebase';
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
      if (user.emailVerified) {
        this.router.navigateByUrl('/app/me');
      }
    });
  }

  sendEmailVerification(user: User) {
    this.authService
      .sendEmailVerification(user)
      .subscribe(
        () => this.toastService.success('Le mail a été envoyé. Vérifiez votre boite mail. 📬'),
        error => this.toastService.error(error.code)
      );
  }
}

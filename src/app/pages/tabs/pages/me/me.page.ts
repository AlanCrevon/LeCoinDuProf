import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'firebase';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-me',
  templateUrl: './me.page.html',
  styleUrls: ['./me.page.scss']
})
export class MePage implements OnInit {
  user: User;
  publicUserForm: FormGroup;
  privateUserForm: FormGroup;

  constructor(
    public authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.publicUserForm = this.buildPublicUserForm(user);
      this.privateUserForm = this.buildPrivateUserForm(user);
    });
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.toastService.success('Au revoir et à bientôt 👋 !');
      this.router.navigateByUrl('/');
    });
  }

  buildPublicUserForm(user: User): FormGroup {
    return this.formBuilder.group({
      id: user.uid,
      username: user.displayName
    });
  }

  buildPrivateUserForm(user: User): FormGroup {
    return this.formBuilder.group({
      email: user.email
    });
  }
}

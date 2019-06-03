import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  /** Reactive login form */
  loginForm: FormGroup;

  /**
   * Constructor
   * @param authService used to log the user in
   * @param formBuilder required to create reactive form
   */
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private router: Router
  ) {}

  /**
   * On component initilization, build reactive login form
   */
  ngOnInit() {
    this.loginForm = this.buildLoginForm();
  }

  /**
   * Create a reactive login module asking to provide email and password
   */
  buildLoginForm(): FormGroup {
    return this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  /**
   * Log the user in using email and password
   * @param loginForm email/password form
   */
  login(loginForm: FormGroup) {
    this.authService.login(loginForm.value.email, loginForm.value.password).subscribe(
      success => this.redirectAfterLogin(),
      (error: firebase.auth.Error) => {
        this.toastService.error(error.message);
      }
    );
  }

  /**
   * Log the user in using an identity provider
   * @param provider identity provider
   */
  loginWithProvider(provider: 'google') {
    this.authService.loginWithProvider(provider).subscribe(
      success => this.redirectAfterLogin(),
      (error: firebase.auth.Error) => {
        this.toastService.error(error.message);
      }
    );
  }

  /**
   * Redirect user after logged in
   */
  redirectAfterLogin() {
    this.toastService.success('Bienvenue !');
    this.router.navigateByUrl(this.authService.loggedInUrl);
  }
}

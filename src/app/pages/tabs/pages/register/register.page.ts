import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { ModalTosPage } from './modules/modal-tos/modal-tos.page';
import { MustMatch } from './validators/must-match.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.registerForm = this.buildRegisterForm();
  }

  buildRegisterForm(): FormGroup {
    return this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        confirm: ['', Validators.required],
        tos: [false, Validators.requiredTrue]
      },
      {
        validator: MustMatch('password', 'confirm')
      }
    );
  }

  register(registerForm: FormGroup) {
    this.authService.register(registerForm.value.email, registerForm.value.password).subscribe(
      () => {
        this.toastService.success('Bienvenue sur LeCoinDuProf ! 🎉');
        this.login(registerForm);
      },
      error => {
        this.toastService.error(error.code);
      }
    );
  }

  login(registerForm: FormGroup) {
    this.authService.login(registerForm.value.email, registerForm.value.password).subscribe(success => {
      this.router.navigateByUrl('/app/boxes');
    });
  }

  async openTosModal() {
    const modal = await this.modalController.create({
      component: ModalTosPage
    });
    await modal.present();
  }
}

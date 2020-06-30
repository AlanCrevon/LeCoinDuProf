import { Component, OnInit } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Item } from 'src/app/types/item';
import { AppUser } from 'src/app/types/app-user';
import { firestore, User } from 'firebase/app';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-report-create',
  templateUrl: './report-create.component.html',
  styleUrls: ['./report-create.component.scss']
})
export class ReportCreateComponent implements OnInit {
  item: Item;
  form: FormGroup;

  constructor(
    private dbService: DbService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    public modalController: ModalController,
    private toastService: ToastService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.authService.appUser$.subscribe(appUser => {
      this.form = this.buildForm(appUser, this.item);
    });
  }

  buildForm(appUser: AppUser, item: Item) {
    return this.formBuilder.group({
      author: [appUser.id, [Validators.required]],
      item: [item.id, [Validators.required]],
      content: [undefined, Validators.required],
      comment: [''],
      status: ['open', Validators.required],
      modifiedAt: firestore.FieldValue.serverTimestamp(),
      createdAt: [firestore.FieldValue.serverTimestamp()]
    });
  }

  save(form: FormGroup) {
    this.dbService
      .addDocument('/reports', form.value)
      .then(() => {
        this.toastService.success('🙏 Votre signalemet a bien été enregistré. Merci.');
        this.modalController.dismiss();
      })
      .catch(error =>
        this.toastService.error(`😞 Une erreur s'est produite lors de l'enregistrement de votre signalement`)
      );
  }
}

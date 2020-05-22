import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ModalController, IonInput, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Box } from 'src/app/types/box';
import { GeocodingService } from 'src/app/services/geocoding.service';
import { DbService } from 'src/app/services/db.service';
import { ToastService } from 'src/app/services/toast.service';
import { ExplainLocationComponent } from '../explain-location/explain-location.component';
import { Router } from '@angular/router';
import { firestore } from 'firebase';
import { AppUser } from 'src/app/types/app-user';

@Component({
  selector: 'app-box-edit',
  templateUrl: './box-edit.component.html',
  styleUrls: ['./box-edit.component.scss']
})
export class BoxEditComponent implements OnInit {
  form: FormGroup;
  @Input() box: Box;
  @Input() appUser: AppUser;
  @ViewChild('searchRef', { read: ElementRef, static: false }) searchElementRef: ElementRef;
  @ViewChild('searchRef', { static: true }) search: IonInput;

  isCreatingBox = false;

  constructor(
    public modalController: ModalController,
    private formBuilder: FormBuilder,
    private geocodingService: GeocodingService,
    private dbService: DbService,
    private toastService: ToastService,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    // If the box is not provided, we build a default one
    if (!!!this.box) {
      this.isCreatingBox = true;
      const randomBoxNumber = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
      this.box = {
        name: `Boite ${randomBoxNumber}`,
        owner: this.appUser.id,
        createdAt: firestore.FieldValue.serverTimestamp(),
        modifiedAt: firestore.FieldValue.serverTimestamp(),
        coordinates: this.appUser.coordinates,
        formatted_address: this.appUser.formatted_address,
        geohash: this.appUser.geohash
      };
    }
    this.form = this.buildForm(this.box);

    if (!!!this.searchElementRef) {
      setTimeout(() => this.ionViewDidEnter(), 100);
      return;
    }
    const inputField = this.searchElementRef.nativeElement.getElementsByTagName('input')[0];
    this.geocodingService.getLongLat(inputField).then(location => {
      this.form.get('formatted_address').setValue(location.formatted_address);
      this.form.get('coordinates').setValue(location.coordinates);
      this.form.get('geohash').setValue(location.geohash);
    });
  }

  buildForm(box: Box): FormGroup {
    return this.formBuilder.group({
      name: [box.name, Validators.required],
      owner: [box.owner, Validators.required],
      createdAt: [box.createdAt, Validators.required],
      modifiedAt: firestore.FieldValue.serverTimestamp(),
      coordinates: [box.coordinates, [Validators.required]],
      geohash: [box.geohash, [Validators.required]],
      formatted_address: [box.formatted_address, [Validators.required]]
    });
  }

  save(box: Box, form: FormGroup, isCreatingBox: boolean) {
    if (isCreatingBox) {
      this.createBox(form);
    } else {
      this.updateBox(box, form);
    }
  }

  private updateBox(box: Box, form: FormGroup) {
    this.dbService
      .updateDocument(`/boxes/${box.id}`, form.value)
      .then(() => {
        this.toastService.success('📦 La boite est mise à jour');
      })
      .catch(reason => {
        this.toastService.error('📦 Erreur lors de la mise à jour de la boite');
      });
  }

  private createBox(form: FormGroup) {
    console.log('Creating box', form.value);
    this.dbService
      .addDocument<Box>(`/boxes`, form.value)
      .then(async newBox => {
        await this.modalController.dismiss();
        this.router.navigateByUrl(`/app/boxes/${newBox.id}`);
        this.toastService.success('📦 La boite est crée');
      })
      .catch(reason => {
        console.log(reason);
        this.toastService.error('📦 Erreur lors de la création de la boite');
      });
  }

  async delete(box: Box) {
    const alert = await this.alertController.create({
      header: 'Effacer la boite ?',
      message: 'La boite et son contenu seront définitivement effacés',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Confirmer',
          handler: async () => {
            await this.modalController.dismiss('delete');
            this.dbService
              .deleteDocument(`/boxes/${box.id}`)
              .then(async () => {
                await this.router.navigateByUrl(`/app/boxes`);
                this.toastService.success(`📦 La boite a été effacée`);
              })
              .catch(reason => {
                this.toastService.error(`📦 Erreur lors de l'effacement de la boite`);
              });
          }
        }
      ]
    });

    await alert.present();
  }

  async openExplainLocationModal() {
    const modal = await this.modalController.create({
      component: ExplainLocationComponent
    });
    modal.present();
  }
}

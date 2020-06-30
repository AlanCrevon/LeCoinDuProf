import { Component, OnInit, Input } from '@angular/core';
import { Item } from 'src/app/types/item';
import { Box } from 'src/app/types/box';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { firestore, User } from 'firebase/app';
import { CategoriesService } from 'src/app/services/categories.service';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';
import { ToastService } from 'src/app/services/toast.service';
import { CameraService } from 'src/app/modules/camera/services/camera.service';
import { Router } from '@angular/router';
import { FirestorageService } from 'src/app/modules/upload/services/firestorage.service';
import { DocumentReference, DocumentData } from '@angular/fire/firestore';
import { GeoDocumentReference } from 'geofirestore';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-item-edit',
  templateUrl: './item-edit.component.html',
  styleUrls: ['./item-edit.component.scss']
})
export class ItemEditComponent implements OnInit {
  @Input() box: Box;
  @Input() item: Item;
  form: FormGroup;

  currentItemPicture: string;
  itemPicture;
  itemThumbnail;
  hasToDeleteItemPicture = false;

  constructor(
    private dbService: DbService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    public categoriesService: CategoriesService,
    public modalController: ModalController,
    private toastService: ToastService,
    private cameraService: CameraService,
    private alertController: AlertController,
    public toastController: ToastController,
    private router: Router,
    private firestorageService: FirestorageService
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.authService.user$.subscribe(user => {
      this.form = this.buildForm(user, this.box, this.item);
    });

    // Load item's picture
    if (!!this.item && this.item.hasPicture) {
      this.firestorageService.download(`/users/${this.item.owner}/${this.item.id}/item`).subscribe(url => {
        this.currentItemPicture = url;
      });
    }
  }

  buildForm(user: User, box: Box, item: Item) {
    return this.formBuilder.group({
      name: [!!item ? item.name : undefined, [Validators.required]],
      owner: [!!item ? item.owner : user.uid, [Validators.required]],
      box: [!!item ? item.box : box.id, [Validators.required]],
      description: [!!item ? item.description : undefined, [Validators.required]],
      category: [!!item ? item.category : 1, [Validators.required]],
      isShared: [!!item ? item.isShared : false, [Validators.required]],
      modifiedAt: firestore.FieldValue.serverTimestamp(),
      createdAt: [!!item ? item.createdAt : firestore.FieldValue.serverTimestamp()],
      formatted_address: [!!item ? item.formatted_address : box.formatted_address],
      coordinates: [!!item ? item.coordinates : box.coordinates],
      geohash: [!!item ? item.geohash : box.geohash],
      canGive: [!!item ? item.canGive : true, [Validators.required]],
      canLend: [!!item ? item.canLend : true, [Validators.required]],
      canExchange: [!!item ? item.canExchange : true, [Validators.required]],
      canSend: [!!item ? item.canSend : true, [Validators.required]],
      // Not : always set to false in the form
      // and let the saving process update the field
      hasPicture: [false, [Validators.required]]
    });
  }

  async save(item: Item, form: FormGroup, itemPicture, itemThumbnail) {
    if (!!!item) {
      const documentRef: any = await this.createItem(form);
      item = Object.assign(form.value, { id: documentRef.id });
    } else {
      await this.updateItem(item, form);
    }
    // Upload picture
    if (!!itemPicture) {
      await this.firestorageService.uploadImage(
        `users/${form.value.owner}/${item.id}/item`,
        this.itemPicture,
        `Image de l'objet`
      );
    }
    // Upload thumbnail
    if (!!itemThumbnail) {
      await this.firestorageService.uploadImage(
        `users/${item.owner}/${item.id}/thumbnail`,
        this.itemThumbnail,
        `Miniature de l'image de l'objet`
      );
    }
    // Delete picture if required
    if (!!this.hasToDeleteItemPicture) {
      await this.firestorageService.delete(`users/${item.owner}/${item.id}/thumbnail`);
      await this.firestorageService.delete(`users/${item.owner}/${item.id}/item`);
    }
    // Mark the item as updated
    if (!!itemPicture || !!itemThumbnail || !!this.currentItemPicture) {
      const update = {
        modifiedAt: firestore.FieldValue.serverTimestamp(),
        hasPicture: true
      };
      await this.dbService.updateDocument(`/items/${item.id}`, update);
    }
  }

  private createItem(form: FormGroup): Promise<void | DocumentReference | GeoDocumentReference> {
    return this.dbService
      .addDocument<Item>('/items', form.value)
      .then(documentRef => {
        this.dbService.getDocument<Item>(`/items/${documentRef.id}`).subscribe(item => {
          this.item = item;
          this.form = this.buildForm(undefined, undefined, item);
          this.toastService.success(`✏️ L'objet a été ajouté dans la boite`);
        });
        return documentRef;
      })
      .catch(reason => {
        this.toastService.error(`✏️ Erreur lors de l'ajout de l'objet dans la boite`);
      });
  }

  private updateItem(item: Item, form: FormGroup): Promise<void> {
    return this.dbService
      .updateDocument(`/items/${item.id}`, form.value)
      .then(() => {
        this.toastService.success(`✏️ L'objet a été mis à jour`);
        this.item = Object.assign(this.item, form.value);
      })
      .catch(reason => {
        this.toastService.error(`✏️ Erreur lors de la mise à jour de l'objet`);
      });
  }

  async selectImage() {
    this.cameraService
      .selectImage()
      .pipe(take(1))
      .subscribe(data => {
        this.currentItemPicture = !!data ? this.currentItemPicture : undefined;
        this.itemPicture = !!data ? data.picture : undefined;
        this.itemThumbnail = !!data ? data.thumbnail : undefined;
        this.hasToDeleteItemPicture = !!!data;
      });
  }

  async delete(item: Item) {
    const alert = await this.alertController.create({
      header: `Effacer l'objet ?`,
      message: `L'objet sera définitivement effacé`,
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
              .deleteDocument(`/items/${item.id}`)
              .then(async () => {
                await this.router.navigateByUrl(`/app/boxes/${item.box}`);
                this.toastService.success(`✏️ L'objet est effacé`);
              })
              .catch(reason => {
                this.toastService.error(`✏️ Erreur lors de l'effacement de l'objet`);
              });
          }
        }
      ]
    });

    await alert.present();
  }

  async confirm(event) {
    if (event.detail.checked) {
      const alert = await this.alertController.create({
        header: `Partager ?`,
        message: `Je certifie être pleinement propriétaire de l'objet que je partage.
        En particulier, je confirme ne pas partager un objet dont la propriété
        revient à mon employeur ou ma collectivité.`,
        buttons: [
          {
            text: 'Annuler',
            handler: async () => {
              this.form.get('isShared').setValue(false);
            }
          },
          {
            text: 'Confirmer'
          }
        ]
      });

      await alert.present();
    }
  }
}

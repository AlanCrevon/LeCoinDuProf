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
    if (!!!item) {
      // Provide a default item
      item = this.buildDefaultItem(user, box);
    }

    return this.formBuilder.group({
      name: [item.name, [Validators.required]],
      owner: [item.owner, [Validators.required]],
      box: [item.box, [Validators.required]],
      description: [item.description, [Validators.required]],
      category: [item.category, [Validators.required]],
      isShared: [item.isShared, [Validators.required]],
      modifiedAt: firestore.FieldValue.serverTimestamp(),
      createdAt: [item.createdAt],
      formatted_address: [item.formatted_address],
      coordinates: [item.coordinates],
      geohash: [item.geohash],
      canGive: [item.canGive, [Validators.required]],
      canLend: [item.canLend, [Validators.required]],
      canExchange: [item.canExchange, [Validators.required]],
      canSend: [item.canSend, [Validators.required]],
      // Note : always set to false in the form
      // and let the saving process update the field
      hasPicture: [false, [Validators.required]]
    });
  }

  buildDefaultItem(user: User, box: Box): Item {
    return {
      name: undefined,
      owner: user.uid,
      box: box.id,
      description: undefined,
      category: 1,
      isShared: false,
      createdAt: firestore.FieldValue.serverTimestamp(),
      modifiedAt: firestore.FieldValue.serverTimestamp(),
      formatted_address: box.formatted_address,
      coordinates: box.coordinates,
      geohash: box.geohash,
      canGive: true,
      canLend: true,
      canExchange: true,
      canSend: true,
      hasPicture: false
    };
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

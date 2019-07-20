import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-tos',
  templateUrl: './modal-tos.page.html',
  styleUrls: ['./modal-tos.page.scss']
})
export class ModalTosPage {
  constructor(public modalController: ModalController) {}
}

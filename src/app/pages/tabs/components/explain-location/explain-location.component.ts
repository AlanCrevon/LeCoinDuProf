import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-explain-location',
  templateUrl: './explain-location.component.html',
  styleUrls: ['./explain-location.component.scss']
})
export class ExplainLocationComponent implements OnInit {
  constructor(public modalController: ModalController) {}

  ngOnInit() {}
}

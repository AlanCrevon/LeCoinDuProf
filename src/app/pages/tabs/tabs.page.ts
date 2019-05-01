import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss']
})
export class TabsPage implements OnInit {
  public platformWidth: any;

  constructor(public navigationService: NavigationService, public platform: Platform) {}

  ngOnInit() {
    this.platformWidth = window.innerWidth;
    this.onResize();
  }

  onResize() {
    this.platform.ready().then(() => {
      this.platform.resize.subscribe(() => {
        this.platformWidth = window.innerWidth;
      });
    });
  }
}

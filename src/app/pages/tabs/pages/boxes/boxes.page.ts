import { Component, OnInit } from '@angular/core';
import { User } from 'firebase';
import { Box } from 'src/app/types/box';
import { DbService } from 'src/app/services/db.service';
import { AuthService } from 'src/app/services/auth.service';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-boxes',
  templateUrl: './boxes.page.html',
  styleUrls: ['./boxes.page.scss']
})
export class BoxesPage implements OnInit {
  user: User;
  boxes: Observable<Box[]>;

  constructor(private dbService: DbService, private authService: AuthService) {}

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.boxes = this.dbService.getCollection<Box>('boxes', ref => ref.where('owner', '==', user.uid));
    });
  }

  async createBox(user: User) {
    /*const box: Box = {
      name: 'Nouvelle boite',
      owner: user.uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      location:
    };
    const documentRef = await this.dbService.addDocument('/boxes', box);
    */
  }
}

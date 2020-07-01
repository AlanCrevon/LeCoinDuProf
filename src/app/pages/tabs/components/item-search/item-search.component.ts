import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalController, IonInput } from '@ionic/angular';
import { CategoriesService } from 'src/app/services/categories.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { AppUser } from 'src/app/types/app-user';
import { GeocodingService } from 'src/app/services/geocoding.service';

@Component({
  selector: 'app-item-search',
  templateUrl: './item-search.component.html',
  styleUrls: ['./item-search.component.scss']
})
export class ItemSearchComponent implements OnInit {
  searchForm: FormGroup;
  filters;

  @ViewChild('searchRef', { read: ElementRef }) searchElementRef: ElementRef;
  @ViewChild('searchRef', { static: true }) search: IonInput;

  constructor(
    public modalController: ModalController,
    public categoriesService: CategoriesService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private geocodingService: GeocodingService
  ) {}

  ngOnInit() {
    this.authService.appUser$.subscribe(appUser => {
      this.searchForm = this.buildSearchForm(appUser, this.filters);
    });
  }

  ionViewDidEnter() {
    if (!!!this.searchElementRef) {
      setTimeout(() => this.ionViewDidEnter(), 100);
      return;
    }
    const inputField = this.searchElementRef.nativeElement.getElementsByTagName('input')[0];
    this.geocodingService.getLongLat(inputField).then(location => {
      this.searchForm.get('formatted_address').setValue(location.formatted_address);
      this.searchForm.get('coordinates').setValue(location.coordinates);
      this.searchForm.get('geohash').setValue(location.geohash);
    });
  }

  buildSearchForm(appUser: AppUser | null, filters) {
    return this.formBuilder.group({
      coordinates: filters?.coordinates || appUser?.coordinates,
      geohash: filters?.geohash || appUser?.geohash,
      formatted_address: filters?.formatted_address || appUser?.formatted_address,
      radius: filters?.radius || 5,
      category: filters?.category || null
    });
  }

  onFormattedAddress(address) {
    if (address === '') {
      this.searchForm.get('coordinates').setValue(undefined);
      this.searchForm.get('geohash').setValue(undefined);
    }
  }
}

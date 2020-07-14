import { Injectable } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, RoutesRecognized, ActivationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

interface TitleConfig {
  text: string;
  appendSuffix: boolean;
  customSuffix: string;
}

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected title: Title) {
    this.router.events
      .pipe(
        filter(event => event instanceof ActivationEnd),
        map((event: ActivatedRoute) => event.snapshot.data.title)
      )
      .subscribe(routeTitle => {
        if (!!routeTitle && !!routeTitle.text) {
          this.setTitle(routeTitle.text);
        }
      });
  }

  setTitle(title: string, customSuffix?: string): void {
    let newTitle: string = environment.title.default;
    if (title) {
      newTitle += ` - ` + title;
      if (!!customSuffix) {
        newTitle += customSuffix;
      }
      this.title.setTitle(newTitle);
    }
  }
}

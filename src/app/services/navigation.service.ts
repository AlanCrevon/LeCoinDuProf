import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  public appPages = [
    {
      title: 'Partages',
      url: '/app/shared',
      tab: 'shared',
      icon: 'share-outline'
    },
    {
      title: 'Messages',
      url: '/app/chats',
      tab: 'chats',
      icon: 'chatbubbles-outline'
    },
    {
      title: 'Inventaire',
      url: '/app/boxes',
      tab: 'boxes',
      icon: 'cube-outline'
    },
    {
      title: 'Moi',
      url: '/app/me',
      tab: 'me',
      icon: 'person-outline'
    }
    /*{
      title: 'Modérer',
      url: '/app/moderate',
      tab: 'moderate',
      icon: 'ios-construct'
    }*/
  ];

  public infoPages = [
    {
      title: 'Page Facebook',
      icon: 'logo-facebook',
      href: 'https://facebook.com/lecoinduprof',
      routerLink: false
    },
    {
      title: 'Fil Twitter',
      icon: 'logo-twitter',
      href: 'https://twitter.com/prof_coin',
      routerLink: false
    },
    {
      title: `L'équipe`,
      icon: 'people-outline',
      href: false,
      routerLink: '/app/team'
    },
    {
      title: `Conditions d'utilisation`,
      icon: 'information-circle-outline',
      href: false,
      routerLink: '/app/tos'
    },
    {
      title: `Open source`,
      icon: 'logo-github',
      href: 'https://github.com/AlanCrevon/LeCoinDuProf',
      routerLink: false
    }
  ];

  constructor(private router: Router) {}

  isActiveRoute(url: string): boolean {
    return this.router.url.startsWith(url);
  }
}

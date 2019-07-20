import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  public appPages = [
    {
      title: 'Partages',
      url: '/app/shared',
      tab: 'shared',
      icon: 'share'
    },
    {
      title: 'Recherches',
      url: '/app/wanted',
      tab: 'wanted',
      icon: 'search'
    },
    {
      title: 'Messages',
      url: '/app/chats',
      tab: 'chats',
      icon: 'chatbubbles'
    },
    {
      title: 'Inventaire',
      url: '/app/boxes',
      tab: 'boxes',
      icon: 'cube'
    },
    {
      title: 'Moi',
      url: '/app/me',
      tab: 'me',
      icon: 'contact'
    },
    {
      title: 'Modérer',
      url: '/app/moderate',
      tab: 'moderate',
      icon: 'construct'
    }
  ];

  public infoPages = [
    {
      title: 'Page Facebook',
      icon: 'logo-facebook',
      href: 'htps://facebook.com/lecoinduprof',
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
      icon: 'contacts',
      href: false,
      routerLink: '/app/team'
    },
    {
      title: `Conditions générales d'utilisation`,
      icon: 'information-circle-outline',
      href: false,
      routerLink: '/app/tos'
    }
  ];

  constructor() {}
}

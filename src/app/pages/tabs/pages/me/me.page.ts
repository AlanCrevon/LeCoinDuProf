import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-me',
  templateUrl: './me.page.html',
  styleUrls: ['./me.page.scss']
})
export class MePage implements OnInit {
  constructor(public authService: AuthService, private router: Router, private toastService: ToastService) {}

  ngOnInit() {}

  logout() {
    this.authService.logout().subscribe(() => {
      this.toastService.success('Au revoir et à bientôt');
      this.router.navigateByUrl('/');
    });
  }
}

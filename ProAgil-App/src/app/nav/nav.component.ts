import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(private authService: AuthService
            , public router: Router
              // tslint:disable-next-line:align
            , private toastr: ToastrService) { }

  ngOnInit() {
  }

  LoggedIn() {
    return this.authService.loggedIn();
  }

  Entrar() {
    this.router.navigate(['/user/login']);
  }

  logout() {
    localStorage.removeItem('token');
    this.toastr.show('log Out');
    this.router.navigate(['/user/login']);
  }
}

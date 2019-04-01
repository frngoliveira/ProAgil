import { Component, OnInit } from '@angular/core';
import { Local } from 'protractor/built/driverProviders';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  eventos: any ;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getEventos();
  }
  getEventos() {
    this.http.get('http://localhost:5000/Api/Values').subscribe(response => {
      this.eventos = response;
    }, error => {
      console.log(error);
    });
  }

}

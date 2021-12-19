import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  usuario:string;
  rolesAsignados:string;

  constructor() { }

  ngOnInit(): void {
    const helper= new JwtHelperService();
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    const decodedToken = helper.decodeToken(token);
    console.log("decodedtoken:",decodedToken);
    this.usuario = decodedToken.user_name;
    this.rolesAsignados = decodedToken.authorities;
  }

}

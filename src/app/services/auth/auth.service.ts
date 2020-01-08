import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

const tokenName = 'token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private isLogged$ = new BehaviorSubject(false);
  private url = `${environment.apiBaseUrl}/api/Home`;
  private user = { UserName: 'Luke', email: '12Luke@skywalker.com' }; // some data about user

  constructor(private http: HttpClient) {

  }

  public get isLoggedIn(): boolean {
    return this.isLogged$.value;
  }

  public login(data): Observable<any> {
    // const headers = new HttpHeaders().set('Access-Control-Allow-Origin', '*');
    return this.http.post(`${this.url}/login`, data)
      .pipe(
       // map((res: { user: any, token: string }) => {
        map((res) => {
          this.isLogged$.next(true);
          return this.user;
        }));
  }

  public logout() {
    return this.http.get(`${this.url}/logout`)
      .pipe(map((data) => {
        localStorage.clear();
        this.user = null;
        this.isLogged$.next(false);
        return of(false);
      }));
  }

  public signup(data) {
    return this.http.post(`${this.url}/registration`, data)
      .pipe(
        map((res: { user: any, token: string }) => {
          // this.user = res.user;
          // localStorage.setItem(tokenName, res.token);
          // // only for example
          // localStorage.setItem('UserName', res.user.UserName);
          // localStorage.setItem('email', res.user.email);
          this.isLogged$.next(true);
          return this.user;
        }));
  }
  public get authToken(): string {
    return localStorage.getItem(tokenName);
  }

  public get userData(): Observable<any> {
    // send current user or load data from backend using token
    return this.loadUser();
  }

  private loadUser(): Observable<any> {
    // use request to load user data with token
    // it's fake and useing only for example
    if (localStorage.getItem('UserName') && localStorage.getItem('email')) {
      this.user = {
        UserName: localStorage.getItem('UserName'),
        email: localStorage.getItem('email'),
      };
    }
    return of(this.user);
  }
}

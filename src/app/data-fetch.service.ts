// tämä on service joka hakee datan serveriltä

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBoard } from './types/board';

@Injectable({
  providedIn: 'root',
})
export class DataFetchService {
  // JSON-serverin osoite
  url = 'http://localhost:3000/boards';
  // http-objekti tarvitaan että voidaan käyttää get-metodia
  private http = inject(HttpClient);

  // hakee kaiken datan serveriltä asynkronisesti ja palauttaa observablen (pitää subscribeä että saa auki)
  getAllBoards(): Observable<IBoard[]> {
    return this.http.get<IBoard[]>(this.url);
  }

  // GET - read data
  // POST - create new post
  // PUT - replace a post
  // PATCH - update part of post
  // DELETE - delete post

  // --------------------------------------

  // Use POST → create data
  // Use GET → read data
  // Use PATCH → update specific fields
  // Use PUT → replace entire object
  // Use DELETE → remove data
}

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { BooksInterface } from './books';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  constructor( private http: HttpClient) { }
  getBooks(params?): Observable<BooksInterface> {
    return this.http.get(`https://www.googleapis.com/books/v1/volumes?q=search+terms`, {params}).pipe(
      map((response: any) => ({
        totalItems: response.totalItems,
        items: response.items.map(i => ({id: i.id, title: i.volumeInfo.title}))
      })),
      catchError(error => {
        return of(error);
      })
    );
  }
}

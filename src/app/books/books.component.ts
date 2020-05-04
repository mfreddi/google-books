import { Component, OnInit, OnDestroy } from '@angular/core';
import { BooksService } from '../books.service';
import { FormGroup, FormControl } from '@angular/forms';
import { StorageService } from '../storage.service';
import { Subject } from 'rxjs';
import { VolumeInfoInterface } from '../volume-info-interface';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.less']
})
export class BooksComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  type = 'books';
  totalItems = 0;
  books: any[] = [];
  showBooks = new Subject<Array<VolumeInfoInterface>>();
  maxResults = 10;
  startIndex = 0;
  isLoading = true;
  isSearching = true;
  searchText = '';
  favoriteKey = 'favoriteBooks';
  favoriteBooks = this.storage.getLocalStorage(this.favoriteKey) || [];

  constructor(private booksService: BooksService, private storage: StorageService) {
    this.searchForm = new FormGroup({
      searchName: new FormControl({value: null, disabled: false}),
    });
    this.searchForm.valueChanges.subscribe(v => {
      this.searchText = v.searchName;
    });
  }
  ngOnInit() {
    this.loadMore();
    this.storage.changes.subscribe((res) => {
      this[res.key] = res.value;
      if (this.type === this.favoriteKey) {
        this.showBooks.next(this.favoriteBooks);
      }
    });
  }
  ngOnDestroy() {
    this.showBooks.complete();
  }
  loadMore(): void {
    this.isLoading = true;
    this.booksService.getBooks({maxResults: this.maxResults, startIndex: this.startIndex}).subscribe((res: any) => {
      this.totalItems = res.totalItems;
      this.books = this.syncBooksFavorite([...this.books, ...res.items]);
      this.isLoading = false;
      this.startIndex += this.maxResults;
      this.showBooks.next(this.books);
    });
  }
  syncBooksFavorite(arr): Array<VolumeInfoInterface> {
    return arr.map((book) => {
      if ([...this.favoriteBooks].findIndex((f: VolumeInfoInterface) => f.id === book.id) !== -1) {
        book.checked = true;
      } else {
        book.checked = false;
      }
      return book;
    });
  }
  showData(type) {
    this.type = type;
    const nextDate = type === 'books' ? this.syncBooksFavorite(this[type]) : this.storage.getLocalStorage(this.favoriteKey);
    this.showBooks.next(nextDate);
  }
  toggleFavorite(e, book): void {
    if (e.target.checked) {
      this.favoriteBooks.push(book);
    } else {
      this.favoriteBooks = this.favoriteBooks.filter(f => f.id !== book.id);
    }
    this.storage.setLocalStore(this.favoriteKey, this.favoriteBooks);
  }

}

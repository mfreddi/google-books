import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { share } from 'rxjs/operators';
import { VolumeInfoInterface } from './volume-info-interface';

@Injectable({
  providedIn: 'root'
})
export class StorageService implements OnDestroy {
  private onSubject = new Subject<{ key: string, value: any }>();
  public changes = this.onSubject.asObservable().pipe(share());

  constructor() {
      this.start();
  }

  ngOnDestroy() {
      this.stop();
  }

  public getLocalStorage(key: string): Array<VolumeInfoInterface> {
    return JSON.parse(localStorage.getItem(key));
  }

  public setLocalStore(key: string, data: Array<VolumeInfoInterface>): void {
      localStorage.setItem(key, JSON.stringify(data));
      this.onSubject.next({key, value: data});
  }

  private start(): void {
      window.addEventListener('storage', this.storageEventListener.bind(this));
  }

  private storageEventListener(event: StorageEvent): void {
      if (event.storageArea === localStorage) {
          let v: any;
          try {
              v = JSON.parse(event.newValue);
          } catch (e) {
              v = event.newValue;
          }
          this.onSubject.next({key: event.key, value: v});
      }
  }

  private stop(): void {
      window.removeEventListener('storage', this.storageEventListener.bind(this));
      this.onSubject.complete();
  }

}

import { HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequestStateService {
  private requests: Map<HttpRequest<unknown>, boolean> = new Map();

  loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

  addRequest(req: HttpRequest<unknown>): void {
    this.requests.set(req, true);
    this.loadingSubject.next(true);
  }

  removeRequest(req: HttpRequest<unknown>): void {
    this.requests.delete(req);

    if (!this.requests.size) {
      this.loadingSubject.next(false);
    }
  }

  getLoadingState(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }
}

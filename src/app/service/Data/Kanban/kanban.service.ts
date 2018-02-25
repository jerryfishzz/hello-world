import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class KanbanService {

  currentDropColumnState: string = "";

  private _currentDropColumnSource = new BehaviorSubject<string>(this.currentDropColumnState);
  currentDropColumn$ = this._currentDropColumnSource.asObservable();

  constructor() { }

  generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  updateCurrentDropColumn(columnId: string): void {
    this.currentDropColumnState = columnId;
    this._currentDropColumnSource.next(columnId);
  }

}

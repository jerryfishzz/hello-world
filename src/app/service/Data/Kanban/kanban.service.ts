import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class KanbanService {

  currentDropColumnState: string = "";

  constructor() { }

  generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  updateCurrentDropColumn(columnId: string): void {
    this.currentDropColumnState = columnId;
  }

}

import { Injectable } from '@angular/core';

@Injectable()
export class KanbanService {

  constructor() { }

  generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

}

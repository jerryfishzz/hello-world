import { Injectable } from '@angular/core';

@Injectable()
export class CardService {

  public cards: any[] = [
    {'id': '1', 'name': 'The', 'party': 'many'}, 
    {'id': '2', 'name': 'possibilities', 'party': 'many'}, 
    {'id': '3', 'name': 'are', 'party': 'many'}, 
    {'id': '4', 'name': 'endless!', 'party': 'many'},
    {'id': '5', 'name': 'Explore', 'party': 'many2'}, 
    {'id': '6', 'name': 'them', 'party': 'many2'}
  ];

  constructor() { }

  updateParty(cardId: string, targetParty: string): void {
    this.cards = this.cards.map(card => {
      if(card.id != cardId) {
        return card;
      }

      card.party = targetParty;
      return card;
    });
  }
}

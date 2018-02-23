import { Component, OnInit, Input } from '@angular/core';
import { DragulaService } from 'ng2-dragula';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  public cards: any[] = [
    {'id': '1', 'name': 'The', 'party': 'many'}, 
    {'id': '2', 'name': 'possibilities', 'party': 'many'}, 
    {'id': '3', 'name': 'are', 'party': 'many'}, 
    {'id': '4', 'name': 'endless!', 'party': 'many'},
    {'id': '5', 'name': 'Explore', 'party': 'many2'}, 
    {'id': '6', 'name': 'them', 'party': 'many2'}
  ];
  public cards1: any[] = [
    {'id': '1', 'name': 'The', 'party': 'many'}, 
    {'id': '2', 'name': 'possibilities', 'party': 'many'}, 
    {'id': '3', 'name': 'are', 'party': 'many'}, 
    {'id': '4', 'name': 'endless!', 'party': 'many'}
  ];
  public cards2: any[] = [
    {'id': '5', 'name': 'Explore', 'party': 'many2'}, 
    {'id': '6', 'name': 'them', 'party': 'many2'}
  ];
  
  cardsForColumn: any[];

  @Input() column: string;

  constructor(private dragulaService: DragulaService) {

    dragulaService.dropModel.subscribe((value) => {
      console.log(`drop: ${value[0]}`);
      this.onDropModel(value.slice(1));
    });
    dragulaService.removeModel.subscribe((value) => {
      console.log(`remove: ${value[0]}`);
      this.onRemoveModel(value.slice(1));
    });
    
  }

  showCards1():void {
    console.log(this.cards1);
  }

  showCards2():void {
    console.log(this.cards2);
  }

  showCardsForColumn():void {
    console.log(this.cardsForColumn);
  }

  private onDropModel(args) {
    let [el, target, source] = args;
    // console.log(el.getAttribute('item-id'));
    // console.log(source.getAttribute('item-id'));
    // console.log(target.getAttribute('item-id'));

    let cardId = el.getAttribute('item-id');
    let targetParty = target.getAttribute('item-id');

    this.cards = this.cards.map(card => {
      if(card.id != cardId) {
        return card;
      }

      card.party = targetParty;
      return card;
    });
  }

  private onRemoveModel(args) {
    let [el, source] = args;
  }

  ngOnInit() {
    this.cardsForColumn = this.cards.filter(card => card.party == this.column);
  }

}

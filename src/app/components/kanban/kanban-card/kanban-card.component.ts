import { Component, OnInit, Input, OnDestroy, IterableDiffers, DoCheck, IterableDiffer } from '@angular/core';
import { ICard } from '../../../service/Data/Kanban/Card/Model/ICard';
import { Subscription } from 'rxjs/Subscription';
import { IColumn } from '../../../service/Data/Kanban/Column/Model/IColumn';
import { CardService } from '../../../service/Data/Kanban/Card/card.service';
import { ColumnService } from '../../../service/Data/Kanban/Column/column.service';
import { BoardService } from '../../../service/Data/Kanban/Board/board.service';
import { DragulaService } from 'ng2-dragula';
import { KanbanService } from '../../../service/Data/Kanban/kanban.service';

@Component({
  selector: 'kanban-card',
  templateUrl: './kanban-card.component.html',
  styleUrls: ['./kanban-card.component.css']
})
export class KanbanCardComponent implements OnInit, OnDestroy, DoCheck {

  cards: ICard[] = [];  // The array of all cards
  cardSubscription: Subscription;

  columnsForCardsToMove: IColumn[];  // The array of columns that cards can move to
  columnsForMovingSubscription: Subscription;

  newComments: string = "";
  cardsForColumn: ICard[];

  private iterableDiffer: any;

  @Input() columnEntityId: string;  // The id of the direct parent column of cards
  @Input() reserved: boolean;  // The mark to identify if a column is idle or archive, or not.  True for idle and archive, false for others.

  constructor(private _cardService: CardService, private _columnService: ColumnService, private _boardService: BoardService, private _iterableDiffers: IterableDiffers, private _kanbanService: KanbanService) { 
    this.iterableDiffer = this._iterableDiffers.find([]).create(null);
  }

  /**
   * 
   * @param cardId  The id of the moving card
   * @param cardColumnEntityId  The id of the column which the card belongs to before moving
   * @param destinationColumnId  The id of the column which the card will move to
   */
  moveToOtherColumn(cardId: string, cardColumnEntityId: string, destinationColumnId: string): void {
    this._cardService.moveToOtherColumn(cardId, cardColumnEntityId, destinationColumnId);
  }

  // showCards(): void {
  //   console.log(this.cardsForColumn);
  // }

  initializeCardsForColumn(): void {
    this.cardsForColumn = [];
    let theColumn: IColumn = this._columnService.getColumn(this.columnEntityId);
    let directCards: string[] = theColumn.directCards;
    if(directCards.length) {
      for(let directCard of directCards) {
        this.cardsForColumn.push(this.cards.filter(card => card.cardId == directCard)[0]);
      }
    }
  }

  ngOnInit() {
    this.cardSubscription = this._cardService.cards$.subscribe(cards => this.cards = cards);
    
    /**   
     * Not like column is only created once,
     * cards will be recreated everytime switching between boards.
     * So columnsForCardsToMove will update along with the board switching.
     */
    this.columnsForMovingSubscription = this._columnService.columns$.subscribe(columns => this.columnsForCardsToMove = columns.filter(column => column.cardOnly === true && column.boardEntityId === this._boardService.displayingBoardState.boardId));

    /**
     * Use the order of directCards in the column to initialize cardsForColumn
     */
    this.initializeCardsForColumn();

    // this.cardsForColumn = [];
    // let theColumn: IColumn = this._columnService.getColumn(this.columnEntityId);
    // let directCards: string[] = theColumn.directCards;
    // if(directCards.length) {
    //   for(let directCard of directCards) {
    //     this.cardsForColumn.push(this.cards.filter(card => card.cardId == directCard)[0]);
    //   }
    // }
    
  }

  ngOnDestroy() {
    this.cardSubscription.unsubscribe();
    this.columnsForMovingSubscription.unsubscribe();
  }

  

  ngDoCheck() {
    let changes = this.iterableDiffer.diff(this.cardsForColumn);
    if (changes) {
      // console.log('Changes detected!');
      // console.log(this.cardsForColumn);

      let currentDropColumnId: string = this._kanbanService.currentDropColumnState;
      console.log(currentDropColumnId);
      console.log(this.columnEntityId);

      this._columnService.updateDirectCards(this.columnEntityId, this.cardsForColumn, currentDropColumnId);

      if(currentDropColumnId == this.columnEntityId) {
        this._kanbanService.updateCurrentDropColumn("");
      }
      
    }
}

}

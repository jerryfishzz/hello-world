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
  cardSubscription: Subscription;

  columnsForCardsToMove: IColumn[];  // The array of columns that cards can move to.  Move button for test only.
  columnsForMovingSubscription: Subscription;  // Move button for test only

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

    let idleColumnId: string = this._boardService.displayingBoardState.idleColumn;
    let archiveColumnId: string = this._boardService.displayingBoardState.archiveColumn;

    this._columnService.updateColumn(cardColumnEntityId, cardId, "", "delete", "");
    this._columnService.updateColumn(destinationColumnId, cardId, "", "add", "");

    if(cardColumnEntityId == idleColumnId) this._columnService.updateIdleColumn(cardColumnEntityId);
    if(destinationColumnId == idleColumnId) this._columnService.updateIdleColumn(destinationColumnId);

    if(cardColumnEntityId == archiveColumnId) this._columnService.updateArchiveColumn(cardColumnEntityId);
    if(destinationColumnId == archiveColumnId) this._columnService.updateArchiveColumn(destinationColumnId);


    this._cardService.moveToOtherColumn(cardId, cardColumnEntityId, destinationColumnId);
  }

  ngOnInit() {
    /**
     * Card status needs column to decide.  If column doesn't update, card can't keep up with the update too.  So must update column first.
     */
    this.cardSubscription = this._cardService.cards$.subscribe(cards => {
      this.cardsForColumn = [];

      /**
       * Use the order of directCards in the column to initialize the order cardsForColumn
       */
      let theColumn: IColumn = this._columnService.getColumn(this.columnEntityId);
      let directCards: string[] = theColumn.directCards;  // This is the update from column.

      if(directCards.length) {
        for(let directCard of directCards) {
          this.cardsForColumn.push(cards.filter(card => card.cardId == directCard)[0]);
        }
      }
    });

    
    this.columnsForMovingSubscription = this._columnService.columns$.subscribe(columns => this.columnsForCardsToMove = columns.filter(column => column.cardOnly === true && column.boardEntityId === this._boardService.displayingBoardState.boardId));  // Move button for test only

  }

  ngOnDestroy() {
    this.cardSubscription.unsubscribe();

    this.columnsForMovingSubscription.unsubscribe();  // Move button for test only
  }

  

  ngDoCheck() {

    /**
     * trigger by changes of cardsForColumn from dragula dropping events
     */
    let changes = this.iterableDiffer.diff(this.cardsForColumn);
    if (changes) {
      let currentDropColumnId: string = this._kanbanService.currentDropColumnState;

      this._columnService.updateDirectCards(this.columnEntityId, this.cardsForColumn, currentDropColumnId);

      /**
       * Reset CurrentDropColumn 
       */
      if(currentDropColumnId == this.columnEntityId) {
        this._kanbanService.updateCurrentDropColumn("");  
      }
      
    }
  }

}

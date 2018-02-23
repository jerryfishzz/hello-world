import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ICard } from '../../../service/Data/Kanban/Card/Model/ICard';
import { Subscription } from 'rxjs/Subscription';
import { IColumn } from '../../../service/Data/Kanban/Column/Model/IColumn';
import { CardService } from '../../../service/Data/Kanban/Card/card.service';
import { ColumnService } from '../../../service/Data/Kanban/Column/column.service';
import { BoardService } from '../../../service/Data/Kanban/Board/board.service';
import { DragulaService } from 'ng2-dragula';

@Component({
  selector: 'kanban-card',
  templateUrl: './kanban-card.component.html',
  styleUrls: ['./kanban-card.component.css']
})
export class KanbanCardComponent implements OnInit, OnDestroy {

  cards: ICard[] = [];  // The array of all cards
  cardSubscription: Subscription;

  columnsForCardsToMove: IColumn[];  // The array of columns that cards can move to
  columnsForMovingSubscription: Subscription;

  newComments: string = "";
  cardsForColumn: ICard[];

  @Input() columnEntityId: string;  // The id of the direct parent column of cards
  @Input() reserved: boolean;  // The mark to identify if a column is idle or archive, or not.  True for idle and archive, false for others.

  constructor(private _cardService: CardService, private _columnService: ColumnService, private _boardService: BoardService, private dragulaService: DragulaService) { 

    dragulaService.dropModel.subscribe((value) => {
      // console.log(`drop: ${value[0]}`);
      this.onDropModel(value.slice(1));
    });
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

  private onDropModel(args) {
    let [el, target, source] = args;
    // console.log(el.getAttribute('itemId'));
    // console.log(source.getAttribute('itemId'));
    // console.log(target.getAttribute('itemId'));

    let cardId = el.getAttribute('itemId');
    let cardColumnEntityId = source.getAttribute('itemId');
    let destinationColumnId = target.getAttribute('itemId');

    this.moveToOtherColumn(cardId, cardColumnEntityId, destinationColumnId);
  }

  ngOnInit() {
    this.cardSubscription = this._cardService.cards$.subscribe(cards => this.cards = cards);
    
    /**   
     * Not like column is only created once,
     * cards will be recreated everytime switching between boards.
     * So columnsForCardsToMove will update along with the board switching.
     */
    this.columnsForMovingSubscription = this._columnService.columns$.subscribe(columns => this.columnsForCardsToMove = columns.filter(column => column.cardOnly === true && column.boardEntityId === this._boardService.displayingBoardState.boardId));

    this.cardsForColumn = this.cards.filter(card => card.columnEntityId == this.columnEntityId);
  }

  ngOnDestroy() {
    this.cardSubscription.unsubscribe();
    this.columnsForMovingSubscription.unsubscribe();
  }

}

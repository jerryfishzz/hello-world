import { Injectable } from '@angular/core';
import { ICard } from './Model/ICard';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { ColumnService } from '../Column/column.service';
import { BoardService } from '../Board/board.service';

@Injectable()
export class CardService {

  /** 
   * The variable holding all cards information
   * as well as the initial value.
   * Initial value can be empty: [].  
   * The data inside is just an example.
   */
  cardState: ICard[] = [
    {
      "cardId": "51",
      "cardName": "Card 1",
      "cardType": "task",
      "columnEntityId": "20",
      "boardEntityId": "100",
      "boardEntityType": "project",
      "comments": "Jump to 51.",
      "inArchive": false
    }
  ];
  
  private _cardSource = new BehaviorSubject<ICard[]>(this.cardState);  // Use the initial card value to create a tracking object for card information
  cards$ = this._cardSource.asObservable();  // Make that tracking object as an observable

  constructor(private _columnService: ColumnService, private _boardService: BoardService) { }

  /**
   * @param newCard  The new card object
   */
  addCard(newCard: ICard): void {
    this.cardState.push(newCard);  // Insert the new card into the array which contains all cards information
    this._cardSource.next(this.cardState);  // Push the latest cardState status to its observable

    this._columnService.updateColumn(newCard.columnEntityId, newCard.cardId, "", "add", "");  // Update the column where new card is added
  }

  /**
   * @param id  The id of the card which is deleting
   */
  deleteCard(id: string) {
    let theCard = this.getCard(id);

    this.cardState = this.cardState.filter(c => id !== c.cardId);
    this._cardSource.next(this.cardState);

    this._columnService.updateColumn(theCard.columnEntityId, id, "", "delete", "");
  }

  updateCard(cardId: string, newComments: string, newName: string) {
    console.log("service: " + newComments);
    this.cardState = this.cardState.map(item => {
      if (item.cardId !== cardId || newComments === "" || newName === "") {
        return item;
      }

      item.comments = newComments;
      item.cardName = newName;
      return item;
    });
    this._cardSource.next(this.cardState);
  }

  moveToOtherColumn(cardId: string, cardColumnEntityId: string, destinationColumnId: string): void {

    /**
     * Need to judge if the column moving to is archive
     */
    let toArchive: boolean = false;
    if (this._boardService.displayingBoardState.archiveColumn === destinationColumnId) {
      toArchive = true;
    }

    this.cardState = this.cardState.map(item => {
      if (item.cardId !== cardId) {
        return item;
      }

      item.inArchive = toArchive ? true : false;
      item.columnEntityId = destinationColumnId;
      return item;
    });
    this._cardSource.next(this.cardState);

    this._columnService.updateColumn(cardColumnEntityId, cardId, "", "delete", "");
    this._columnService.updateColumn(destinationColumnId, cardId, "", "add", "");
  }

  getCard(id: string): ICard {
    return this.cardState.filter(card => id === card.cardId)[0];
  }

  /**
   * Deleting a column will cause all its cards to abondon this column
   * and move into idle column.
   * @param cardId  Id of the card which resides in the deleted column 
   * @param idleColumnId  Id of the idle column
   */
  abandonColumn(cardId: string, idleColumnId: string): void {

    this.cardState = this.cardState.map(item => {
      if (item.cardId !== cardId) {
        return item;
      }

      item.columnEntityId = idleColumnId;
      return item;
    });
    this._cardSource.next(this.cardState);

    this._columnService.updateColumn(idleColumnId, cardId, "", "add", "");
  }

  /**
   * When a board is deleted, all its card will be deleted simutaneously.
   * @param boardEntityId  Id of the board which will be deleted.
   */
  deleteCardsByBoardEntityId(boardEntityId: string): void {
    this.cardState = this.cardState.filter(card => card.boardEntityId !== boardEntityId);
    this._cardSource.next(this.cardState);
  }

}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { KanbanService } from '../../../service/Data/Kanban/kanban.service';
import { BoardService } from '../../../service/Data/Kanban/Board/board.service';
import { CardService } from '../../../service/Data/Kanban/Card/card.service';
import { CardFactory } from '../../../service/Data/Kanban/Card/Factory/CardFactory';
import { ICard } from '../../../service/Data/Kanban/Card/Model/ICard';

@Component({
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.css']
})
export class CardDetailComponent implements OnInit {

  url: string = "";  // URL of the opening page

  cardId: string = "";
  cardName: string = "";
  cardType: string = "";
  columnEntityId: string = ""
  boardEntityId: string = "";
  boardEntityType: string = "";
  comments: string = "";
  inArchive: boolean;

  constructor(private _router: Router, private _route: ActivatedRoute, private _kanbanService: KanbanService, private _cardService: CardService, private _boardService: BoardService) { }

  /**
   * Judge according to URL to tell this page is adding or updating 
   * @param url  URL of the opening page
   */
  isAddCard(url: string): boolean {
    // console.log("is");
    let re = /^\/kanban\/addcard\/[A-Za-z0-9]+/i;
    console.log(re.test(url));
    return re.test(url);
  }

  addCard(): void {
    var cardFactory: CardFactory = new CardFactory();

    let newCard: ICard = cardFactory.generateGenericCard(this.cardId, this.cardName, this.cardType, this.columnEntityId, this.boardEntityId, this.boardEntityType, this.comments, this.inArchive);
    
    this._cardService.addCard(newCard);
    
    this.onBack();  // Return to the main page
  }

  updateCard(): void {
    this._cardService.updateCard(this.cardId, this.comments, this.cardName);
    this.onBack();
  }

  deleteCard(): void {
    this._cardService.deleteCard(this.cardId);
    this.onBack();
  }

  /**
   * Throw a card into archive column
   */
  archiveCard(): void {
    let destinationColumn: string = this._boardService.displayingBoardState.archiveColumn;
    this._cardService.moveToOtherColumn(this.cardId, this.columnEntityId, destinationColumn);
    this.onBack();
  }

  ngOnInit() {
    let url = this._router.url;
    console.log(this._router.url);
    this.url = url;

    if (this.isAddCard(url)) {
      this.cardId = this._kanbanService.generateId();
      console.log(this.cardId);
      this.boardEntityId = this._boardService.displayingBoardState.boardId;
      console.log(this.boardEntityId);
      this.boardEntityType = this._boardService.getBoard(this.boardEntityId).boardType;
      console.log(this.boardEntityType);
      this.cardType = this.boardEntityType == "portfolio" ? "project" : "task";
      console.log(this.cardType)
      this.columnEntityId = this.url.split("/")[3];
      console.log(this.columnEntityId);
      this.inArchive = false;
    } else {
      this._route.params.subscribe((params: Params) => {
        let cardId: string = params['id'];
        let theModifyingCard: ICard = this._cardService.getCard(cardId);

        this.cardId = cardId;
        this.cardName = theModifyingCard.cardName;
        this.cardType = theModifyingCard.cardType;
        this.columnEntityId = theModifyingCard.columnEntityId;
        this.comments = theModifyingCard.comments;
        this.boardEntityId = theModifyingCard.boardEntityId;
        this.boardEntityType = theModifyingCard.boardEntityType;
        this.inArchive = theModifyingCard.inArchive;
      });
    }
  }

  onBack(): void {
    this._router.navigate(['/kanban']);
  }

}

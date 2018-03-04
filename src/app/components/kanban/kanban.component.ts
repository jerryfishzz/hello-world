import { Component, OnInit, OnDestroy } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { Subject } from 'rxjs/Subject';
import { CardService } from '../../service/Data/Kanban/Card/card.service';
import { KanbanService } from '../../service/Data/Kanban/kanban.service';
import { ColumnService } from '../../service/Data/Kanban/Column/column.service';
import { BoardService } from '../../service/Data/Kanban/Board/board.service';

@Component({
  selector: 'kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css']
})
export class KanbanComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject();

  constructor(private _dragulaService: DragulaService, private _cardService: CardService, private _kanbanService: KanbanService, private _columnService: ColumnService, private _boardService: BoardService) {

    /**
     * Card drag and drop
     */
    _dragulaService.dropModel.asObservable().takeUntil(this.destroy$).subscribe((value) => {
      // console.log(`drop model: ${value[0]}`);
      this.onDropModel(value.slice(1));
    });

    // Back to where it comes from when out of range
    _dragulaService.setOptions('card-bag', {
      revertOnSpill: true
    });



    /**
     * Column drag and drop
     */
    _dragulaService.setOptions('column-bag', {

      // When outer columns try to drop in inner columns, it must be simple column
      accepts: function (el, target, source, sibling) {
          // console.log(target.classList);
          // console.log(el.classList);
          if (target.classList.contains('inter-draggable')) {
              return el.classList.contains('inter-draggable');
          }
          return true;
      },
      moves: function (el, source, handle) {
        // console.log(el.classList);
        // console.log(source.classList);
        // console.log(handle.className);
        return handle.className;  // when not existing, the handle is on cards.
      },
      direction: 'horizontal'  // Set the drag and drop by the direction of horizon
    });  

    _dragulaService.drop.asObservable().takeUntil(this.destroy$).subscribe((value) => {
      console.log(`drop: ${value[0]}`);
      this.onDrop(value.slice(1));
    });
  }

  /**
   * Data process for cards after dropping
   * @param args  Including three args inside.  
   *              el: the manipulated element
   *              target: the target container
   *              source: the source container
   */
  private onDropModel(args) {
    let [el, target, source] = args;
    // console.log("drop action");
    // console.log(el.getAttribute('itemId'));
    // console.log(source.getAttribute('itemId'));
    // console.log(target.getAttribute('itemId'));

    let cardId = el.getAttribute('itemId');
    let cardColumnEntityId = source.getAttribute('itemId');
    let destinationColumnId = target.getAttribute('itemId');

    this._kanbanService.updateCurrentDropColumn(destinationColumnId);

    this._columnService.updateColumn(cardColumnEntityId, cardId, "", "delete", "");
    this._columnService.updateColumn(destinationColumnId, cardId, "", "add", "");

    this._cardService.moveToOtherColumn(cardId, cardColumnEntityId, destinationColumnId, false);
  }



  private onDrop(args) {
    // console.log(args);
    let [el, target, source, sibling] = args;
    console.log(target);
    let children = target.children;
    // console.log(children.length);

    let idleId: string = this._boardService.displayingBoardState.idleColumn;
    let archiveId: string = this._boardService.displayingBoardState.archiveColumn;


    let orderOfChildren: string[] = [];
    for(let child of children) {
      let childId = child.getAttribute('itemId');
      if(childId == idleId || childId == archiveId) continue;
      orderOfChildren.push(child.getAttribute('itemId'));
    }
    console.log(orderOfChildren);
    // console.log(target.children[1].getAttribute('itemId'));
    // do something
    // let index = this.getElementIndex(el);
    // console.log(index);
  }

  // private getElementIndex(el: any) {
  //   return [].slice.call(el.parentElement.children).indexOf(el);
  // }



  ngOnInit() {
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

}

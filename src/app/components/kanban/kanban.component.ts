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
          if (target.classList.contains('inter-draggable')) {
              return el.classList.contains('inter-draggable');
          }
          return true;
      },
      moves: function (el, source, handle) {
        return handle.className;  // when not existing, the handle is on cards.
      },
      direction: 'horizontal'  // Set the drag and drop by the direction of horizon
    });  

    _dragulaService.drop.asObservable().takeUntil(this.destroy$).subscribe((value) => {
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
    let idleColumnId: string = this._boardService.displayingBoardState.idleColumn;
    let archiveColumnId: string = this._boardService.displayingBoardState.archiveColumn;
    
    let [el, target, source] = args;

    let cardId = el.getAttribute('itemId');
    let cardColumnEntityId = source.getAttribute('itemId');
    let destinationColumnId = target.getAttribute('itemId');

    this._kanbanService.updateCurrentDropColumn(destinationColumnId);

    this._columnService.updateColumn(cardColumnEntityId, cardId, "", "delete", "");
    this._columnService.updateColumn(destinationColumnId, cardId, "", "add", "");

    if(cardColumnEntityId == idleColumnId) this._columnService.updateIdleColumn(cardColumnEntityId);
    if(destinationColumnId == idleColumnId) this._columnService.updateIdleColumn(destinationColumnId);

    if(cardColumnEntityId == archiveColumnId) this._columnService.updateArchiveColumn(cardColumnEntityId);
    if(destinationColumnId == archiveColumnId) this._columnService.updateArchiveColumn(destinationColumnId);

    this._cardService.moveToOtherColumn(cardId, cardColumnEntityId, destinationColumnId, false);
  }

  private onDrop(args) {
    let [el, target, source, sibling] = args;

    let columnId = el.getAttribute('itemId');
    let sourceId = source.getAttribute('itemId');
    let targetId = target.getAttribute('itemId');
    let children = target.children;

    let idleId: string = this._boardService.displayingBoardState.idleColumn;
    let archiveId: string = this._boardService.displayingBoardState.archiveColumn;
    
    let orderOfChildren: string[] = [];
    for(let child of children) {
      let childId = child.getAttribute('itemId');
      if(childId == idleId || childId == archiveId) continue;
      orderOfChildren.push(child.getAttribute('itemId'));
    }
    
    /**
     * Outer column order changes
     */
    if(target.classList.contains('parentDraggable')) {
      this._boardService.adjustDirectSubOrder(targetId, orderOfChildren);

      if(source.classList.contains('childDraggable')) {
        this._columnService.freeColumn(columnId, sourceId, true);  // Can change the last arg to false depending on the real working environment requirement
      }
    } 

    /**
     * Inner column order changes 
     */
    if(target.classList.contains('childDraggable')) {
      /**
       * Outer column becomes inner column 
       */
      if(source.classList.contains('parentDraggable')) {
        let boardId = source.getAttribute('itemId');
        this._boardService.updateBoard(boardId, columnId, "delete", true);  // Can change the last arg to false depending on the real working environment requirement

        // Can be commented off according to the real needs
        this._boardService.updateDisplayingBoard(boardId);
      }

      this._columnService.adjustSubOrder(targetId, orderOfChildren);

      if(source.classList.contains('parentDraggable')) {
        this._columnService.moveToOtherColumn(columnId, "", targetId, true, true);  // Can change the second last arg to false depending on the real working environment requirement
      }

      // child-to-child move in different columns
      if(source.classList.contains('childDraggable') && (sourceId !== targetId)) {
        this._columnService.moveToOtherColumn(columnId, sourceId, targetId, true, true);  // Can change the second last arg to false depending on the real working environment requirement
      }
      
    }
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}

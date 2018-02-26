import { Component, OnInit, OnDestroy } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { Subject } from 'rxjs/Subject';
import { CardService } from '../../service/Data/Kanban/Card/card.service';
import { KanbanService } from '../../service/Data/Kanban/kanban.service';

@Component({
  selector: 'kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css']
})
export class KanbanComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject();

  constructor(private _dragulaService: DragulaService, private _cardService: CardService, private _kanbanService: KanbanService) {
    _dragulaService.dropModel.asObservable().takeUntil(this.destroy$).subscribe((value) => {
      // console.log(`drop model: ${value[0]}`);
      this.onDropModel(value.slice(1));
    });

    _dragulaService.setOptions('card-bag', {
      revertOnSpill: true
    });
  }

  private onDropModel(args) {
    let [el, target, source] = args;
    // console.log(el.getAttribute('itemId'));
    // console.log(source.getAttribute('itemId'));
    // console.log(target.getAttribute('itemId'));

    let cardId = el.getAttribute('itemId');
    let cardColumnEntityId = source.getAttribute('itemId');
    let destinationColumnId = target.getAttribute('itemId');

    this._kanbanService.updateCurrentDropColumn(destinationColumnId);

    this._cardService.moveToOtherColumn(cardId, cardColumnEntityId, destinationColumnId, false);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

}

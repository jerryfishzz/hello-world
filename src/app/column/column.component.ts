import { Component, OnInit, OnDestroy } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { Subject } from 'rxjs/Subject';
import { CardService } from '../card/card.service';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.css']
})
export class ColumnComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject();
  columns: string[] = ['many', 'many2'];

  constructor(private dragulaService: DragulaService, private _cardService: CardService) {

    this.dragulaService.dropModel.asObservable().takeUntil(this.destroy$).subscribe((value) => {
      console.log(`drop model: ${value[0]}`);
      this.onDropModel(value.slice(1));
    });

    dragulaService.setOptions('card-bag', {
      revertOnSpill: true
    });
  }

  private onDropModel(args) {
    let [el, target, source] = args;
    console.log(el.getAttribute('item-id'));
    console.log(source.getAttribute('item-id'));
    console.log(target.getAttribute('item-id'));

    let cardId = el.getAttribute('item-id');
    let targetParty = target.getAttribute('item-id');

    this._cardService.updateParty(cardId, targetParty);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

}

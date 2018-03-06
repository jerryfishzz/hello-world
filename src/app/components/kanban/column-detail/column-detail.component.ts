import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { IColumn } from '../../../service/Data/Kanban/Column/Model/IColumn';
import { ColumnService } from '../../../service/Data/Kanban/Column/column.service';
import { Subscription } from 'rxjs/Subscription';
import { BoardService } from '../../../service/Data/Kanban/Board/board.service';

@Component({
  selector: 'column-detail',
  templateUrl: './column-detail.component.html',
  styleUrls: ['./column-detail.component.css']
})
export class ColumnDetailComponent implements OnInit, OnDestroy {

  @Input() columnName: string;
  @Input() columnId: string;

  newName: string = "";
  show: boolean;

  theColumn: IColumn;
  // theColumnSubscription: Subscription;

  // private iterableDiffer: any;

  constructor(private _columnService: ColumnService, private _boardService: BoardService) { }

  updateColumnDetail(id: string) {
    this._columnService.updateColumnDetail(this.columnId, this.newName);
    this.show = !this.show;
  }

  ngOnInit() {
    // console.log("column detail init");
    this.newName = this.columnName;
    this.show = (this.columnName !== "" ? true : false);
    // this.theColumnSubscription = this._boardService.displayingBoard$.subscribe(() => {
      // let columnId = this._boardService.displayingBoardState.
      this.theColumn = this._columnService.getColumn(this.columnId);  // This is from columnState, not from idle or archive.
      // console.log(this.theColumn);
      // console.log("column detail sub");
    // });
  }

  ngOnDestroy() {
    // this.theColumnSubscription.unsubscribe();
  }

}

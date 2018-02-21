import { Component, OnInit, Input } from '@angular/core';
import { IColumn } from '../../../service/Data/Kanban/Column/Model/IColumn';
import { ColumnService } from '../../../service/Data/Kanban/Column/column.service';

@Component({
  selector: 'column-detail',
  templateUrl: './column-detail.component.html',
  styleUrls: ['./column-detail.component.css']
})
export class ColumnDetailComponent implements OnInit {

  @Input() columnName: string;
  @Input() columnId: string;

  newName: string = "";
  show: boolean;
  theColumn: IColumn;

  constructor(private _columnService: ColumnService) { }

  updateColumnDetail(id: string) {
    this._columnService.updateColumnDetail(this.columnId, this.newName);
    this.show = !this.show;
  }

  ngOnInit() {
    this.newName = this.columnName;
    this.show = (this.columnName !== "" ? true : false);
    this.theColumn = this._columnService.getColumn(this.columnId);
  }
  
}

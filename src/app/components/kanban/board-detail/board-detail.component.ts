import { Component, OnInit, Input } from '@angular/core';
import { IBoard } from '../../../service/Data/Kanban/Board/Model/IBoard';

@Component({
  selector: 'board-detail',
  templateUrl: './board-detail.component.html',
  styleUrls: ['./board-detail.component.css']
})
export class BoardDetailComponent implements OnInit {
  @Input() displayingBoard: IBoard;
  
  constructor() { }

  ngOnInit() {
  }

}

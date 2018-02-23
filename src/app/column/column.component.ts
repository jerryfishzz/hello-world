import { Component, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.css']
})
export class ColumnComponent implements OnInit {

  columns: string[] = ['many', 'many2'];

  constructor(private dragulaService: DragulaService) {
    dragulaService.setOptions('card-bag', {
      revertOnSpill: true
    });
  }

  ngOnInit() {
  }

}

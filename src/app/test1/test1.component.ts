import { Component, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula';

@Component({
  selector: 'app-test1',
  templateUrl: './test1.component.html',
  styleUrls: ['./test1.component.css']
})
export class Test1Component implements OnInit {

  isClassVisible: boolean = true;

  constructor(private dragulaService: DragulaService) { 
    // dragulaService.setOptions('parent-bag', {
    //   removeOnSpill: false,
    //   moves: function(el, container, handle) {
    //     return !handle.classList.contains('child');
    //   }
    // });
  }



  ngOnInit() {
  }

}

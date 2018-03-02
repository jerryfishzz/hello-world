import { Component, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula';

@Component({
  selector: 'app-test1',
  templateUrl: './test1.component.html',
  styleUrls: ['./test1.component.css']
})
export class Test1Component implements OnInit {

  constructor(private dragulaService: DragulaService) { 
    // dragulaService.setOptions('parent-bag', {
    //   removeOnSpill: false,
    //   // drop: function (el, target, source) {
    //   //     if (target.classList) {
    //   //         return target.classList.contains('childDraggable');
    //   //     }
    //   //     return false;
    //   // }
    //   moves: function(el, container, handle) {
    //     return !handle.classList.contains('child');
    //   }
    // });
    // dragulaService.setOptions('child-bag', {
    //   removeOnSpill: false,
    //   // drop: function(el, container, target) {
    //   //   return target.classList.contains('child');
    //   // }
    //   // moves: function(el, container, handle) {
    //   //   return !handle.classList.contains('child');
    //   // }
    // });
  }



  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { IOfficial } from './official';

@Component({
  selector: 'app-official',
  templateUrl: './official.component.html',
  styleUrls: ['./official.component.css']
})
export class OfficialComponent implements OnInit {

  // public many: Array<string> = ['The', 'possibilities', 'are', 'endless!'];
  // public many2: Array<string> = ['Explore', 'them'];

  public many: IOfficial[] = [
    {'id': '1', 'name': 'The', 'party': 'many'}, 
    {'id': '2', 'name': 'possibilities', 'party': 'many'}, 
    {'id': '3', 'name': 'are', 'party': 'many'}, 
    {'id': '4', 'name': 'endless!', 'party': 'many'}
  ];
  public many2: IOfficial[] = [
    {'id': '5', 'name': 'Explore', 'party': 'many2'}, 
    {'id': '6', 'name': 'them', 'party': 'many2'}
  ];


  constructor(private dragulaService: DragulaService) {
    dragulaService.drag.subscribe((value) => {
      console.log(`drag: ${value[0]}`);  // bag name
      // console.log(value);  
      // console.log(value[1]);  // self div
      // console.log(value[2]);  // parent div
      this.onDrag(value.slice(1));
    });
    dragulaService.drop.subscribe((value) => {
      console.log(`drop: ${value[0]}`);
      this.onDrop(value.slice(1));
    });
    dragulaService.over.subscribe((value) => {
      console.log(`over: ${value[0]}`);
      this.onOver(value.slice(1));
    });
    dragulaService.out.subscribe((value) => {
      console.log(`out: ${value[0]}`);
      this.onOut(value.slice(1));
    });

    dragulaService.setOptions('another-bag', {
      revertOnSpill: true
    });

    dragulaService.dropModel.subscribe((value) => {
      // console.log(`drop: ${value[0]}`);
      // console.log(value);
      this.onDropModel(value.slice(1));
    });
    dragulaService.removeModel.subscribe((value) => {
      console.log(`remove: ${value[0]}`);
      this.onRemoveModel(value.slice(1));
    });
  }

  private hasClass(el: any, name: string) {
    return new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)').test(el.className);
  }

  private addClass(el: any, name: string) {
    // console.log("add");
    if (!this.hasClass(el, name)) {
      el.className = el.className ? [el.className, name].join(' ') : name;
    }
  }

  private removeClass(el: any, name: string) {
    if (this.hasClass(el, name)) {
      el.className = el.className.replace(new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)', 'g'), '');
    }
  }

  private onDrag(args) {
    let [e, el] = args;
    // console.log(e);
    // console.log(el);
    this.removeClass(e, 'ex-moved');
  }

  private onDrop(args) {
    let [e, el] = args;
    this.addClass(e, 'ex-moved');
  }

  private onOver(args) {
    let [e, el, container] = args;
    this.addClass(el, 'ex-over');
  }

  private onOut(args) {
    let [e, el, container] = args;
    this.removeClass(el, 'ex-over');
  }


  private onDropModel(args) {
    let [e, target, source] = args;
    // do something else
    console.log(target);
    this.addClass(e, 'ex-moved');
  }

  private onRemoveModel(args) {
    let [el, source] = args;
    // do something else
  }

  showMany(): void {
    console.log(this.many);
  }

  showMany2(): void {
    console.log(this.many2);
  }

  ngOnInit() {
  }

}

import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-test',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  numberOfTicks = 0;

  constructor(private ref: ChangeDetectorRef) { 
    // setInterval(() => {
    //   this.numberOfTicks++;
    //   // the following is required, otherwise the view will not be updated
    //   this.ref.markForCheck();
    // }, 1000);
  }

  refresh(): void {
    this.numberOfTicks++;
    this.ref.markForCheck();
  }

  ngOnInit() {
    console.log("hi");  // this solution don't trigger this
  }

}

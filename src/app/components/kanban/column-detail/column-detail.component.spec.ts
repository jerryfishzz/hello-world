import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnDetailComponent } from './column-detail.component';

describe('ColumnDetailComponent', () => {
  let component: ColumnDetailComponent;
  let fixture: ComponentFixture<ColumnDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColumnDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

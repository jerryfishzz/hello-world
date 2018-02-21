import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { KanbanComponent } from './components/kanban/kanban.component';
import { KanbanBoardComponent } from './components/kanban/kanban-board/kanban-board.component';
import { KanbanCardComponent } from './components/kanban/kanban-card/kanban-card.component';
import { KanbanColumnComponent } from './components/kanban/kanban-column/kanban-column.component';
import { BoardDetailComponent } from './components/kanban/board-detail/board-detail.component';
import { CardDetailComponent } from './components/kanban/card-detail/card-detail.component';
import { ColumnDetailComponent } from './components/kanban/column-detail/column-detail.component';
import { KanbanService } from './service/Data/Kanban/kanban.service';
import { BoardService } from './service/Data/Kanban/Board/board.service';
import { CardService } from './service/Data/Kanban/Card/card.service';
import { ColumnService } from './service/Data/Kanban/Column/column.service';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    AppComponent,
    KanbanComponent,
    KanbanBoardComponent,
    KanbanCardComponent,
    KanbanColumnComponent,
    BoardDetailComponent,
    CardDetailComponent,
    ColumnDetailComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: 'kanban/addcard/:id', component: CardDetailComponent },
      { path: 'kanban/card-detail/:id', component: CardDetailComponent }     
    ]),
    FormsModule
  ],
  providers: [KanbanService, BoardService, CardService, ColumnService],
  bootstrap: [AppComponent]
})
export class AppModule { }

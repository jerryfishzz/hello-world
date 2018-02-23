import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DragulaModule } from 'ng2-dragula/ng2-dragula';

import { AppComponent } from './app.component';
import { DragulaComponent } from './dragula/dragula.component';
import { OfficialComponent } from './official/official.component';
import { ColumnComponent } from './column/column.component';
import { BoardComponent } from './board/board.component';
import { CardComponent } from './card/card.component';
import { CardService } from './card/card.service';


@NgModule({
  declarations: [
    AppComponent,
    DragulaComponent,
    OfficialComponent,
    ColumnComponent,
    BoardComponent,
    CardComponent
  ],
  imports: [
    BrowserModule,
    DragulaModule
  ],
  providers: [CardService],
  bootstrap: [AppComponent]
})
export class AppModule { }

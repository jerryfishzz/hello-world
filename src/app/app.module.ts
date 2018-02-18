import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DragulaModule } from 'ng2-dragula/ng2-dragula';

import { AppComponent } from './app.component';
import { DragulaComponent } from './dragula/dragula.component';
import { OfficialComponent } from './official/official.component';


@NgModule({
  declarations: [
    AppComponent,
    DragulaComponent,
    OfficialComponent
  ],
  imports: [
    BrowserModule,
    DragulaModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

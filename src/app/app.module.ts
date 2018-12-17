import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { VideoComponentComponent } from './video-component/video-component.component';
import { VgCoreModule } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { FileSelectDirective } from 'ng2-file-upload';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { SubtitleEditorComponent } from './subtitle-editor/subtitle-editor.component';

@NgModule({
  declarations: [
    AppComponent,
    VideoComponentComponent,
    FileSelectDirective,
    SubtitleEditorComponent
  ],
  imports: [
    BrowserModule,
    VgCoreModule,
    VgControlsModule,
    HttpClientModule,
    HttpModule,
    FormsModule
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }

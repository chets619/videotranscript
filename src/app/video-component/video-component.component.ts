import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import * as Vtt from 'vtt-creator';
import * as vttToJson from "vtt-json";
import { Http, Response } from '@angular/http';
import 'rxjs/Rx';

const URL = window.URL;

@Component({
  selector: 'app-video-component',
  templateUrl: './video-component.component.html',
  styleUrls: ['./video-component.component.styl']
})
export class VideoComponentComponent implements OnInit {

  private videoUrl = '';
  private jsonResult = {};
  private showVideo = false;
  private subtitleLoaded = false;
  @ViewChild("inputUpload") uploadBtn: ElementRef;
  @ViewChild("subtitleUpload") subtitleBtn: ElementRef;

  constructor(private http: Http, private el: ElementRef) { }

  ngOnInit() {
    var v = new Vtt();
    v.add(1.05, 4, 'Never drink liquid nitrogen.', 'align:middle line:84%');
    v.add(5, 9, 'It will perforate your stomach.<br>You could die.');

    // this.saveFile(v.toString());
  }

  onClickUpload() {
    this.uploadBtn.nativeElement.click();
  }

  loadVideo() {
    let file = this.uploadBtn.nativeElement.files[0];
    let fileURL = URL.createObjectURL(file);
    let videoNode = document.querySelector('video');
    videoNode.src = fileURL;
    this.showVideo = true;
  }

  uploadSubtitle() {
    this.subtitleBtn.nativeElement.click();
  }

  //save vtt file
  saveFile(data) {
    let name = 'sample.vtt';
    let type = 'data:attachment/text';
    if (data != null && navigator.msSaveBlob)
      return navigator.msSaveBlob(new Blob([data], { type: type }), name);

    let a = document.createElement("a");
    document.body.appendChild(a);
    var url = window.URL.createObjectURL(new Blob([data], { type: type }));
    a.href = url;
    a.download = name;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  vttChanged($event) {
    const a = $event.currentTarget.files[0];
    let currFile = new FileReader();
    const self = this;

    currFile.onload = function (e) {
      var contents: any = e.target;
      let filecontent = contents.result;

      //vtt to json
      vttToJson(filecontent).then((result) => {
        self.jsonResult = result;
        self.subtitleLoaded = true;
      });
    }
    currFile.readAsText(a);
  }
}

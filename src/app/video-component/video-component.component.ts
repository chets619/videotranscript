import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import * as Vtt from 'vtt-creator';
import * as vttToJson from "vtt-json";
import { Http, Response } from '@angular/http';
import 'rxjs/Rx';

const URL = window.URL;

export class SubtitleObject {
  startTime: number = null;
  endTime: number = null;
  subtitleText = '';
}

@Component({
  selector: 'app-video-component',
  templateUrl: './video-component.component.html',
  styleUrls: ['./video-component.component.styl']
})

export class VideoComponentComponent implements OnInit {

  private videoUrl = '';
  private jsonResult = [];
  private showVideo = false;
  private subtitleLoaded = false;
  private subtitleCollection = [];
  private currIndex: number = null;
  private currSubObj: SubtitleObject = null;
  @ViewChild("inputUpload") uploadBtn: ElementRef;
  @ViewChild("videoplayer") videoPlayer: ElementRef;
  @ViewChild("subtitleUpload") subtitleBtn: ElementRef;

  constructor(private http: Http, private el: ElementRef) { }

  ngOnInit() {

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

  saveSubtitle() {
    let v = new Vtt();

    this.subtitleCollection.forEach(element => {
      v.add(Number(element.startTime), Number(element.endTime), element.subtitleText);
    });

    this.saveFile(v.toString());
  }

  setStartTime() {
    if (typeof this.currIndex == "number") {
      this.currIndex = null;
      this.currSubObj = null;
    }
    let currTime = this.videoPlayer.nativeElement.currentTime;

    if (this.currSubObj && this.currSubObj.startTime) {
      this.currSubObj.endTime = currTime.toFixed(3);
      this.subtitleCollection.push(this.currSubObj);
      this.currSubObj = null;
    } else {
      this.currSubObj = new SubtitleObject();
      this.currSubObj.startTime = currTime.toFixed(3);
    }
  }

  select(i: number) {
    this.currIndex = i;

    this.currSubObj = this.subtitleCollection[i];
  }

  processSubtitles() {
    this.jsonResult.forEach(element => {
      this.subtitleCollection.push({
        startTime: element.start / 1000,
        endTime: element.end / 1000,
        subtitleText: element.part
      });
    });
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

        self.processSubtitles();
      });
    }
    currFile.readAsText(a);
  }

  convertToTime(seconds: any) {
    let date = new Date(null);
    date.setSeconds(Number(seconds));
    return date.toISOString().substr(11, 8);
  }

  convertToSecs(event) {
    let timeNum = event.currentTarget.value.split(":");
    let sum = 0;

    timeNum.forEach((element, index) => {
      sum += Number(element) * Math.pow(60, (2 - index));
    });

    this.currSubObj.startTime = sum;
    this.sortTime();
  }

  onDelete() {
    this.subtitleCollection.splice(this.currIndex, 1);
  }

  goTo(time: string) {
    this.videoPlayer.nativeElement.currentTime = Number(time);
  }

  sortTime() {
    this.subtitleCollection.sort((a, b) => {
      return Number(a.startTime) - Number(b.startTime);
    })
  }

  @HostListener('document:keyup', ['$event'])
  onKeypress($event) {
    if ($event.keyCode === 32 && this.subtitleLoaded && $event.target.tagName != "TEXTAREA") {
      this.setStartTime();
    }
  }
}

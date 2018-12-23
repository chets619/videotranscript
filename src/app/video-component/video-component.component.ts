import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import * as Vtt from 'vtt-creator';
import { Http, Response } from '@angular/http';
import 'rxjs/Rx';
import { DomSanitizer } from '@angular/platform-browser';

const URL = window.URL;
declare var convertVttToJson: any;

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
  private showSubtitleMessage = false;
  private isTranscriptSelected = false;
  private isHelpShown = false;
  private timer: any;
  subtitleUrl: any = '';
  private transcriptText: string | ArrayBuffer = '';
  @ViewChild("inputUpload") uploadBtn: ElementRef;
  @ViewChild("videoplayer") videoPlayer: ElementRef;
  @ViewChild("subtitleUpload") subtitleBtn: ElementRef;

  constructor(private http: Http, private el: ElementRef, private sanitizer: DomSanitizer) { }

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
    let vttObj = this.generateVttObject();

    this.saveFile(vttObj.toString());
  }

  generateVttObject() {
    let v = new Vtt();

    this.subtitleCollection.forEach(element => {
      v.add(Number(element.startTime), Number(element.endTime), element.subtitleText);
    });

    return v;
  }

  onPreview() {
    let subObj = this.generateVttObject();
    clearTimeout(this.timer);
    this.createSubtitleBlobURL(subObj.toString());
    this.showSubtitleMessage = true;
    this.videoPlayer.nativeElement.textTracks[0].mode = 'showing';
    this.timer = setTimeout(() => {
      this.showSubtitleMessage = false;
    }, 5000)
  }

  createSubtitleBlobURL(data): any {
    let name = 'sample.vtt';
    let type = 'data:attachment/text';
    if (data != null && navigator.msSaveBlob)
      return navigator.msSaveBlob(new Blob([data], { type: type }), name);
    var url = window.URL.createObjectURL(new Blob([data], { type: type }));
    this.subtitleUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);

    return url;
  }

  //save vtt file
  saveFile(data) {
    let name = 'sample.vtt';
    let a = document.createElement("a");
    a.href = this.createSubtitleBlobURL(data);
    document.body.appendChild(a);
    a.download = name;
    a.click();
    // window.URL.revokeObjectURL(url);
    a.remove();
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

  vttChanged($event) {
    const a = $event.currentTarget.files[0];
    let currFile = new FileReader();
    const self = this;

    currFile.onload = function (e) {
      var contents: any = e.target;
      let filecontent = contents.result;

      //vtt to json
      convertVttToJson(filecontent).then((result) => {
        self.jsonResult = result;
        self.subtitleLoaded = true;

        self.processSubtitles();
      });
    }
    currFile.readAsText(a);
  }

  convertToTime(seconds: any) {
    if (!seconds)
      return;
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

    if (event.target.classList[0] == "start-time")
      this.currSubObj.startTime = sum;
    else
      this.currSubObj.endTime = sum;
    this.sortTime();
  }

  onDelete() {
    this.subtitleCollection.splice(this.currIndex, 1);
    this.currSubObj = null;
    this.currIndex = null;
  }

  goTo(time: string) {
    this.videoPlayer.nativeElement.currentTime = Number(time);
  }

  sortTime() {
    this.subtitleCollection.sort((a, b) => {
      return Number(a.startTime) - Number(b.startTime);
    })
  }

  transcriptChanged(event) {
    let file = event.target.files[0];

    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.transcriptText = fileReader.result;
      this.isTranscriptSelected = true;
    }
    fileReader.readAsText(file);
  }

  @HostListener('document:keyup', ['$event'])
  onKeypress($event) {
    if ($event.keyCode === 32 && this.subtitleLoaded && $event.target.tagName != "TEXTAREA") { //space
      if ($event.ctrlKey)
        this.setStartTime();
      else
        this.videoPlayer.nativeElement.paused ? this.videoPlayer.nativeElement.play() : this.videoPlayer.nativeElement.pause();
    } else if ($event.keyCode === 39 && this.subtitleLoaded && $event.target.tagName != "TEXTAREA") { // right key
      this.videoPlayer.nativeElement.currentTime += 5;
    } else if ($event.keyCode === 37 && this.subtitleLoaded && $event.target.tagName != "TEXTAREA") { // left key
      this.videoPlayer.nativeElement.currentTime -= 5;
    }
  }
}

import { Component, OnInit, ElementRef } from '@angular/core';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import * as Vtt from 'vtt-creator';
import * as vttToJson from "vtt-json";
import { Http, Response } from '@angular/http';
import 'rxjs/Rx';

const URL = 'http://localhost:3000/upload';

@Component({
  selector: 'app-video-component',
  templateUrl: './video-component.component.html',
  styleUrls: ['./video-component.component.styl']
})
export class VideoComponentComponent implements OnInit {

  public uploader: FileUploader = new FileUploader({ url: URL });
  private videoUrl = '';
  private jsonResult = {};

  constructor(private http: Http, private el: ElementRef) { }

  ngOnInit() {
    var v = new Vtt();
    v.add(1.05, 4, 'Never drink liquid nitrogen.', 'align:middle line:84%');
    v.add(5, 9, 'It will perforate your stomach.<br>You could die.');

    // this.saveFile(v.toString());
  }

  upload() {
    let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#photo');
    let fileCount: number = inputEl.files.length;
    let formData = new FormData();
    let self = this;

    if (fileCount > 0) {
      //append the key name 'photo' with the first file in the element
      formData.append('photo', inputEl.files.item(0));
      this.http
        .post(URL, formData).map((res: Response) => res.json()).subscribe(
          //map the success function and alert the response
          (success) => {
            self.videoUrl = 'http://localhost:3000/' + success[0].filename;
          },
          (error) => alert(error))
    }
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
      });
    }
    currFile.readAsText(a);
  }
}

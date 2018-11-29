import { Component, OnInit, ElementRef } from '@angular/core';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import * as Vtt from 'vtt-creator';
import * as vttToJson from "vtt-json";
import { Http, Response } from '@angular/http';
import 'rxjs/Rx';
import { UploadService } from '../service/uploadservice';

// const URL = '/api/';
const URL = 'http://localhost:8000/';

@Component({
  selector: 'app-video-component',
  templateUrl: './video-component.component.html',
  styleUrls: ['./video-component.component.styl']
})
export class VideoComponentComponent implements OnInit {

  public uploader: FileUploader = new FileUploader({ url: URL });

  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;
  private videoUrl = '../../../assets/video/sample.mp4';


  constructor(private http: Http, private el: ElementRef) { }

  ngOnInit() {
    var v = new Vtt();
    v.add(1.05, 4, 'Never drink liquid nitrogen.', 'align:middle line:84%');
    v.add(5, 9, ['It will perforate your stomach.', 'You could die.']);

    // this.saveFile(v.toString());

    vttToJson(v.toString()).then((result) => {
      console.log(result)
    });
  }


  //the function which handles the file upload without using a plugin.
  upload() {
    //locate the file element meant for the file upload.
    let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#photo');
    //get the total amount of files attached to the file input.
    let fileCount: number = inputEl.files.length;
    //create a new fromdata instance
    let formData = new FormData();
    //check if the filecount is greater than zero, to be sure a file was selected.
    if (fileCount > 0) { // a file was selected
      //append the key name 'photo' with the first file in the element
      formData.append('photo', inputEl.files.item(0));
      //call the angular http method
      this.http
        //post the form data to the url defined above and map the response. Then subscribe //to initiate the post. if you don't subscribe, angular wont post.
        .post(URL, formData).map((res: Response) => res.text()).subscribe(
          //map the success function and alert the response
          (success) => {
            // let a = JSON.parse(success);
            alert(success);
          },
          (error) => alert(error))
    }
  }






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

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

}

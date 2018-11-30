import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtitleEditorComponent } from './subtitle-editor.component';

describe('SubtitleEditorComponent', () => {
  let component: SubtitleEditorComponent;
  let fixture: ComponentFixture<SubtitleEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubtitleEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubtitleEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { HttpClient } from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";

import { TrainingFormComponent } from "./training-form.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DebugElement } from "@angular/core";
import { By, BrowserModule } from "@angular/platform-browser";

describe("TrainingFormComponent", () => {
  let component: TrainingFormComponent;
  let fixture: ComponentFixture<TrainingFormComponent>;
  let httpMock: HttpTestingController;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TrainingFormComponent],
      imports: [HttpClientTestingModule, FormsModule, ReactiveFormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    de = fixture.debugElement.query(By.css("form"));
    el = de.nativeElement;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("form should be invalid", async(() => {
    component.trainingForm.controls["trainingName"].setValue("");
    component.trainingForm.controls["dateOfStart"].setValue("");
    component.trainingForm.controls["dateOfEnd"].setValue("");
    expect(component.trainingForm.valid).toBeFalsy();
  }));

  it("form should be invalid", async(() => {
    component.trainingForm.controls["trainingName"].setValue("driving");
    component.trainingForm.controls["dateOfStart"].setValue("");
    component.trainingForm.controls["dateOfEnd"].setValue("");
    expect(component.trainingForm.valid).toBeFalsy();
  }));

  it("form should be invalid", async(() => {
    component.trainingForm.controls["trainingName"].setValue("driving");
    component.trainingForm.controls["dateOfStart"].setValue("");
    component.trainingForm.controls["dateOfEnd"].setValue("2010-09-10");
    expect(component.trainingForm.valid).toBeFalsy();
  }));

  it("form should be invalid", async(() => {
    component.trainingForm.controls["trainingName"].setValue("driving");
    component.trainingForm.controls["dateOfStart"].setValue("2019-02-01");
    component.trainingForm.controls["dateOfEnd"].setValue("2010-09-10");
    expect(component.trainingForm.valid).toBeTruthy();
  }));

  it("start date should be earlier than end date 1", async(() => {
    expect(component.validateStartEnd("2019-02-20", "2019-01-20")).toBeFalsy();
  }));

  it("start date should be earlier than end date 2", async(() => {
    expect(component.validateStartEnd("2019-01-20", "2019-03-20")).toBeTruthy();
  }));
});

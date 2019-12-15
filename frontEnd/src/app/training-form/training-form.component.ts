import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl
} from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";
import { DatePipe } from "@angular/common";

import * as moment from "moment";
import Swal from "sweetalert2";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json"
  })
};
const postUrl: string = "http://192.168.1.115:55191/api/traininginfo";

@Component({
  selector: "app-training-form",
  templateUrl: "./training-form.component.html",
  styleUrls: ["./training-form.component.css"]
})
export class TrainingFormComponent implements OnInit {
  trainingForm: FormGroup;

  get trainingName() {
    return this.trainingForm.get("trainingName");
  }
  get dateOfStart() {
    return this.trainingForm.get("dateOfStart");
  }
  get dateOfEnd() {
    return this.trainingForm.get("dateOfEnd");
  }

  constructor(
    private httpClient: HttpClient,
    private trainingInfo: TrainingInfo
  ) {
    //get date of today
    let dp = new DatePipe(navigator.language);
    let p = "y-MM-dd"; // YYYY-MM-DD
    let dtr = dp.transform(new Date(), p);

    //fill today in start and end field by default and initialize validators
    this.trainingForm = new FormGroup({
      trainingName: new FormControl("", [Validators.required]),
      dateOfStart: new FormControl(dtr, [
        Validators.required,
        this.validateDate
      ]),
      dateOfEnd: new FormControl(dtr, [Validators.required, this.validateDate])
    });
  }

  endBeforeStartError: any = { isError: false, errorMessage: "" };
  isValidDate: boolean;

  startDateInValidMessage = "Start Date is not valid";
  endDateInvalidMessage = "End Date is not valid";
  nameRequiredMessage = "Name is required";
  startTimeRequiredMessage = "Start Date required";
  endTimeRequiredMessage = "End Date required";

  nameError: any = { isError: false, errorMessage: "" };
  isValidName: boolean;

  ngOnInit() {}

  //customize date validator to check is a date is valid
  validateDate(control: AbstractControl) {
    if (moment(control.value, "yyyy-MM-dd", true).isValid()) {
      return { validDate: true };
    }
    return null;
  }

  //customize start end date validator to check if end before start
  validateStartEnd(sDate: string, eDate: string) {
    this.isValidDate = true;
    this.endBeforeStartError = {
      isError: false,
      errorMessage: ""
    };

    if (sDate != null && eDate != null && eDate < sDate) {
      this.endBeforeStartError = {
        isError: true,
        errorMessage: "Start Date should be earlier than End Date"
      };
      this.isValidDate = false;
    }
    return this.isValidDate;
  }

  onTrainningDateSubmit(): void {
    let dateOfStart = this.trainingForm.value.dateOfStart;
    let dateOfEnd = this.trainingForm.value.dateOfEnd;
    let trainingName = this.trainingForm.value.trainingName;

    this.isValidDate = this.validateStartEnd(dateOfStart, dateOfEnd);

    //calculate two dates difference, then display if save successfully to DB
    let newStartDate = new Date(dateOfStart);
    let newEndDate = new Date(dateOfEnd);
    let oneDay: number = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    let duration: number =
      Math.round(
        Math.abs((newEndDate.getTime() - newStartDate.getTime()) / oneDay)
      ) + 1;
    let durationString: string =
      trainingName +
      " training duration is: " +
      duration.toString() +
      (duration > 1 ? " days" : " day");

    let resource = JSON.stringify(this.trainingForm.value);

    if (this.isValidDate && this.trainingForm.valid) {
      this.httpClient.post(postUrl, resource, httpOptions).subscribe(
        data => {
          Swal.fire(durationString, data.toString(), "success");
        },
        error => {
          console.log("Error", error);
          Swal.fire({
            type: "error",
            title: "Oops",
            text: error.message
          });
        }
      );
    }
  }
}

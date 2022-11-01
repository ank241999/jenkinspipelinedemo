import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ShareDataService } from '../../../../assets/services/share-data.service';

@Component({
  selector: 'app-server-url',
  templateUrl: './server-url.component.html',
  styleUrls: ['./server-url.component.scss'],
})

export class ServerURLComponent implements OnInit {
  progress = '0';
  form: FormGroup;
  formcontrol: FormControl;
  validationMessages = {
    name1: [
      { type: 'required', message: 'This field is required.' }
    ]
  }

  @ViewChild("name1", { static: false }) name1Ref: ElementRef;

  constructor(private dialogRef: MatDialogRef<MatDialog>,
    public formBuilder: FormBuilder, public dialog: MatDialog,
    private shareDataService: ShareDataService
  ) {
    this.form = formBuilder.group({
      name1: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    if (this.shareDataService.serverUrl != null) {
      this.form.patchValue({
        name1: this.shareDataService.serverUrl
      });
    }
  }

  validateFields(): void {
    if (!this.form.valid) {
      // Mark the form and inputs as touched so the errors messages are shown
      this.form.markAsTouched();
      for (const control in this.form.controls) {
        if (this.form.controls.hasOwnProperty(control)) {
          this.form.controls[control].markAsTouched();
          this.form.controls[control].markAsDirty();
        }
      }
    }
    else {
      this.onclick()
    }
  }

  onclick() {
    this.close();
  }

  close() {
    let ip: string = this.name1Ref.nativeElement.value;
    this.dialogRef.close(ip);
  }
}

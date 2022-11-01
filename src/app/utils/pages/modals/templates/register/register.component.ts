import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-register',
  templateUrl: 'register.component.html',
  styleUrls: ['./styles/register.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RegisterModalComponent {
  constructor(public dialogRef: MatDialogRef<RegisterModalComponent>) {}
}

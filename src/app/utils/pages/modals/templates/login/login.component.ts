import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-login',
  templateUrl: 'login.component.html',
  styleUrls: ['./styles/login.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginModalComponent {
  constructor(public dialogRef: MatDialogRef<LoginModalComponent>) {}
}

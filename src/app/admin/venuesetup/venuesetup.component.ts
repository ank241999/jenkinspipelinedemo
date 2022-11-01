import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UploadimageService } from '../../../assets/services/uploadimage.service';
import { IUploadImage } from '../../../assets/interfaces/iuploadimage';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AlertComponent } from '../../shared';
import { ILocation } from '../../../assets/interfaces/ilocation';
import { LocationService } from '../../../assets/services/location.service';
import { NotificationService } from '../../../assets/services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { ShareDataService } from '../../../assets/services/share-data.service';

import { ActivityConstants } from '../../../assets/constants/activity-constants';
import { clear } from 'console';
import { GenetecsettingsComponent } from './genetecsettings/genetecsettings.component';
var $ = require('jquery');

@Component({
  selector: 'app-venuesetup',
  templateUrl: './venuesetup.component.html',
  styleUrls: ['./venuesetup.component.scss', './styles/file-uploader.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VenuesetupComponent implements OnInit {
  fileToUpload: File = null;
  logoFile: File;
  footPrintFile: File;
  fileName: string;
  imageType: string = "png";
  description: string;
  imageDpi: number = 100;
  uploadImage: IUploadImage;
  itidSelected: any;
  // uploadImage: IUploadImage[] = [];

  placeholderlogo = '../../../assets/images/Liberty-Defense-Logo-.png';
  placeholderfootprint = '../../../assets/images/footprint.JPG';
  // placeholder = 'https://via.placeholder.com/190/0000FF/808080 ?Text=Digital.com';

  uploaders = {
    avatar: {
      progress: undefined,
      url: undefined
    },
    footprint: {
      progress: undefined,
      url: undefined
    },
    files: {
      list: [],
      invalidList: []
    },
    image: {
      progress: undefined,
      url: undefined
    }
  };

  form: FormGroup;

  validationMessages = {
    logo: [
      { type: 'required', message: 'Please Choose Logo.' }
    ],
    venueMap: [
      { type: 'required', message: 'Please Choose Venue Map.' }
    ]
  }

  constructor(private router: Router,
    private uploadImageService: UploadimageService,
    public formBuilder: FormBuilder,
    public dialog: MatDialog,
    private locationService: LocationService,
    private translate: TranslateService,
    private notificationService: NotificationService,
    private shareDataService: ShareDataService) {
    translate.setDefaultLang(ActivityConstants.browserLanguage);
    document.body.style.background = '#EBEBEB';

    this.form = formBuilder.group({
      logo: new FormControl('', Validators.required),
      venueMap: new FormControl('', Validators.required),
    });

    if (this.shareDataService.logoImagePath && this.shareDataService.footPrintImagePath) {
      this.placeholderlogo = this.shareDataService.logoImagePath;
      this.placeholderfootprint = this.shareDataService.footPrintImagePath;
    }
  }

  ngOnInit() {
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
  }

  onSubmit() {
    if (!this.uploaders.avatar.progress && !this.uploaders.footprint.progress) {
      setTimeout(() => {
        this.router.navigateByUrl('/admin/venuesetup/installationtype');
      }, 1000);
      return;
    }
    const formData = new FormData();
    formData.append('logoFile', this.logoFile);
    formData.append('locationFile', this.footPrintFile);

    let notifyMessage: string = "";
    if (this.logoFile != undefined) {
      notifyMessage = "App logo updated successfully";
      if (this.footPrintFile != undefined) {
        notifyMessage = "App logo and Venue Footprint updated successfully";
      }
    }
    else if (this.footPrintFile != undefined) {
      notifyMessage = "Venue Footprint updated successfully";
    }

    if (notifyMessage != "") {
      this.locationService.updateLocation(1, "Hexwave", 1, formData).subscribe(res => {
        if (res['status'] == 200) {
          let location: ILocation = res['data'];
          $("#app_logo").attr("src", location.logoImagePath);
          // localStorage.setItem("logoImagePath", location.logoImagePath);
          // localStorage.setItem("footPrintImagePath", location.footPrintImagePath);
          // localStorage.setItem("logoImageName", location.logoImageName);
          // localStorage.setItem("footPrintImageName", location.footPrintImageName);

          this.shareDataService.logoImagePath = location.logoImagePath;
          this.shareDataService.footPrintImagePath = location.footPrintImagePath;
          this.shareDataService.logoImageName = location.logoImageName;
          this.shareDataService.footPrintImageName = location.footPrintImageName;
          this.shareDataService.setApplicationVariables();

          this.notificationService.showNotification(notifyMessage, 'top', 'center', '', 'info-circle');

          setTimeout(() => {
            this.router.navigateByUrl('/admin/venuesetup/installationtype');
          }, 3000);
        }
      },
        err => {
          console.log("Error occurred: " + err.message);

          if (err["status"] == 500) {
            this.notificationService.showNotification(err["error"], 'top', 'center', 'warning', 'info-circle');
          }
          else {
            this.notificationService.showNotification("Error occurred: " + err.message, 'top', 'center', 'danger', 'info-circle');
          }
        });
    }
    else {
      this.router.navigateByUrl('/admin/venuesetup/installationtype');
    }
  }

  //Image Upload
  onMultipleChange(event: any, uploader: string): void {
    this.onDropzoneMultipleChange(event.target.files, uploader);
  }

  onSingleChange(event: any, uploader: string): void {
    if (event.target.files && event.target.files.length) {

      if (uploader == "avatar") {
        this.logoFile = event.target.files[0];
        $("#revert_logo").show();
      }
      else if (uploader == "footprint") {

        this.footPrintFile = event.target.files[0];
        $("#clear").show();
      }

      this.onDropzoneSingleChange(event.target.files, uploader);
    }
  }

  onDropzoneMultipleChange(fileList: Array<File>, uploader: string): void {
    for (const file of fileList) {
      const l = this.uploaders[uploader].list.push(file);
      this.read(file, this.uploaders[uploader].list[l - 1]);
    }
  }

  onDropzoneSingleChange(fileList: Array<File>, uploader: string): void {
    this.uploaders[uploader] = fileList[0];
    this.read(fileList[0], this.uploaders[uploader]);
  }

  resetUploader(uploader: string): void {
    if (uploader === 'files') {
      this.uploaders[uploader] = {
        list: [],
        invalidList: []
      };
    } else {
      this.uploaders[uploader] = {};
    }
  }

  post(): void {
    const dialogRef = this.dialog.open(AlertComponent, {
      data: {
        icon: 'check-circle',
        iconColor: 'success',
        title: 'File uploaded corretly',
        text: 'Your file has been uploaded',
        button: 'DONE'
      }
    });
    dialogRef.afterClosed().subscribe(_ => {
      this.resetUploader('image');
    });
  }

  read(file: File, store: any): void {
    store.total = (file.size / 1024).toFixed(2);
    store.progress = 0;
    store.loaded = 0;
    const reader = new FileReader();

    reader.onload = (e: any) => {
      store.url = e.target.result;
    };

    reader.onprogress = (e: ProgressEvent) => {
      if (e.lengthComputable) {
        store.progress = Math.round((e.loaded / e.total) * 100);
        store.loaded = (e.loaded / 1024).toFixed(2);
      }
    };

    reader.readAsDataURL(file);
  }

  clearUploadedFile() {
    this.uploaders.avatar = {
      url: this.placeholderlogo,
      progress: undefined
    };
    $("#revert_logo").hide();
    this.uploaders.footprint = {
      url: this.placeholderfootprint,
      progress: undefined
    };
    $("#clear").hide();
  }

  onScreenClose() {
    this.router.navigate(['admin/dashboard'])
  }

  genetecSetting() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    let dialogRef = this.dialog.open(GenetecsettingsComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigateByUrl('/admin/venuesetup');
    });
  }
}

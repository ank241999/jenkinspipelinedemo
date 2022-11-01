import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { IActivityMonitoring } from '../../../assets/interfaces/iactivity-monitoring';
import { IDevice } from '../../../assets/interfaces/idevice';
import { IAllProcessRearrange, IAllProcessResponse, IStateMonitoring } from '../../../assets/interfaces/istatemonitoring';
import { DevicemanagementService } from '../../../assets/services/devicemanagement.service';
import { StatemonitoringService } from '../../../assets/services/statemonitoring.service';
import { ThreatActivityService } from '../../../assets/services/threat-activity.service';
import { environment } from '../../../environments/environment';

@Component({
   selector: 'app-statemonitoring',
   templateUrl: './statemonitoring.component.html',
   styleUrls: ['./statemonitoring.component.scss']
})
export class StatemonitoringComponent implements OnInit {
   viewMode = 'tab1';
   id: any;
   leftDeviceStatus: IStateMonitoring = {
      "Kibana": {
         "status": "DOWN",
         "details": {
            "Error Response http://172.16.2.152:5601": "Service is Down"
         }
      },
      "Report": {
         "status": "DOWN",
         "details": {
            "Success Response http://172.16.2.152:9005": "Service is DOWN"
         }
      },
      "DeviceSetting": {
         "status": "DOWN",
         "details": {
            "Success Response http://172.16.2.152:9003": "Service is DOWN"
         }
      },
      "Prometheus": {
         "status": "DOWN",
         "details": {
            "Error Response http://172.16.2.152:9090": "Service is Down"
         }
      },
      "Grafana": {
         "status": "DOWN",
         "details": {
            "Error Response http://172.16.2.152:3000": "Service is Down"
         }
      },
      "UserSetting": {
         "status": "DOWN",
         "details": {
            "Success Response http://172.16.2.152:9006": "Service is DOWN"
         }
      },
      "AISimulatorFrontend": {
         "status": "DOWN",
         "details": {
            "Success Response http://172.16.2.152:4200": "Service is DOWN"
         }
      },
      "ElasticSearch": {
         "status": "DOWN",
         "details": {
            "Error Response http://172.16.2.152:9200": "Service is Down"
         }
      },
      "AISimulatorBackend": {
         "status": "DOWN",
         "details": {
            "Success Response http://172.16.2.152:9000": "Service is DOWN"
         }
      },
      "ActiveMonitorBackend": {
         "status": "DOWN",
         "details": {
            "Success Response http://172.16.2.152:9001": "Service is DOWN"
         }
      },
      "Auth": {
         "status": "DOWN",
         "details": {
            "Success Response http://172.16.2.152:9002": "Service is DOWN"
         }
      },
      "DeviceDetect": {
         "status": "DOWN",
         "details": {
            "Success Response http://172.16.2.152:9008": "Service is DOWN"
         }
      },
      "Adminer": {
         "status": "DOWN",
         "details": {
            "Success Response http://172.16.2.152:8080": "Service is DOWN"
         }
      },
      "Fluentd": {
         "status": "DOWN",
         "details": {
            "Error Response http://172.16.2.152:24224": "Service is Down"
         }
      },
      "Keycloak": {
         "status": "DOWN",
         "details": {
            "Success Response http://172.16.2.152:8180": "Service is DOWN"
         }
      },
      "ActiveMonitorFrontend": {
         "status": "DOWN",
         "details": {
            "Success Response http://172.16.2.152:4201/#/": "Service is DOWN"
         }
      },
      "HexwaveLog": {
         "status": "DOWN",
         "details": {
            "Error Response http://172.16.2.152:9007": "Service is Down"
         }
      },
      "Kong": {
         "status": "DOWN",
         "details": {
            "Success Response http://172.16.2.152:8000": "Service is DOWN"
         }
      },
      "Peripheral": {
         "status": "DOWN",
         "details": {
            "Success Response http://172.16.2.152:9012": "Service is DOWN"
         }
      },
      "db": {
         "status": "DOWN",
         "details": {
            "Success Response http://172.16.2.152:3306": "Service is DOWN"
         }
      }
   };
   rightDeviceStatus: IStateMonitoring = this.leftDeviceStatus;
   leftDevice: IDevice = {};
   rightDevice: IDevice = {};
   device: IDevice[] = [];
   leftallprocessdata: IAllProcessResponse[] = [];
   rightallprocessdata: IAllProcessResponse[] = [];
   leftallprocessrearrangedata: IAllProcessRearrange = {
      "FPGAInterface": "DOWN",
      "AiAggregate": "DOWN",
      "Capture": "DOWN",
      "DataReduction": "DOWN",
      "Drfits": "DOWN",
      "ImageReconstruction": "DOWN",
      "Recorder": "DOWN",
      "Webapi": "DOWN",
      "Webserver": "DOWN"
   };
   rightallprocessrearrangedata: IAllProcessRearrange = {
      "FPGAInterface": "DOWN",
      "AiAggregate": "DOWN",
      "Capture": "DOWN",
      "DataReduction": "DOWN",
      "Drfits": "DOWN",
      "ImageReconstruction": "DOWN",
      "Recorder": "DOWN",
      "Webapi": "DOWN",
      "Webserver": "DOWN"
   };
   leftdeviceName: string = "Left Device";
   rightdeviceName: string = "Right Device";

   constructor(private router: Router, public deviceService: DevicemanagementService, public stateService: StatemonitoringService, private threatActivityService: ThreatActivityService, private spinnerService: Ng4LoadingSpinnerService) {
      this.spinnerService.show();
      this.devicesIP();
      this.id = setInterval(() => {
         this.serviceStatus();
      }, 60000);
   }

   ngOnInit() {
   }

   serviceStatus() {
      this.stateService.getServiceHealthStatus(this.leftDevice.ipAddress).subscribe(leftres => {
         this.leftDeviceStatus = leftres;
      });

      this.stateService.getServiceHealthStatus(this.rightDevice.ipAddress).subscribe(rightres => {
         this.rightDeviceStatus = rightres;
      });

      this.stateService.getAllProcess(this.leftDevice.ipAddress).subscribe(leftprocessres => {
         console.log(leftprocessres);
         this.leftallprocessdata = leftprocessres;
         for (let item of this.leftallprocessdata) {
            switch (item.name) {
               case "FPGA_Interface":
                  this.leftallprocessrearrangedata.FPGAInterface = (item.statename == "RUNNING" ? "UP" : "DOWN");
                  break;
               case "ai_aggregate":
                  this.leftallprocessrearrangedata.AiAggregate = (item.statename == "RUNNING" ? "UP" : "DOWN");
                  break;
               case "capture":
                  this.leftallprocessrearrangedata.Capture = (item.statename == "RUNNING" ? "UP" : "DOWN");
                  break;
               case "data_reduction":
                  this.leftallprocessrearrangedata.DataReduction = (item.statename == "RUNNING" ? "UP" : "DOWN");
                  break;
               case "drfits":
                  this.leftallprocessrearrangedata.Drfits = (item.statename == "RUNNING" ? "UP" : "DOWN");
                  break;
               case "image_reconstruction":
                  this.leftallprocessrearrangedata.ImageReconstruction = (item.statename == "RUNNING" ? "UP" : "DOWN");
                  break;
               case "recorder":
                  this.leftallprocessrearrangedata.Recorder = (item.statename == "RUNNING" ? "UP" : "DOWN");
                  break;
               case "webapi":
                  this.leftallprocessrearrangedata.Webapi = (item.statename == "RUNNING" ? "UP" : "DOWN");
                  break;
               case "webserver":
                  this.leftallprocessrearrangedata.Webserver = (item.statename == "RUNNING" ? "UP" : "DOWN");
                  break;
               default:
                  console.log("Invalid operator");
                  break;
            }
         }
      });

      this.stateService.getAllProcess(this.rightDevice.ipAddress).subscribe(rightprocessres => {
         console.log(rightprocessres);
         this.rightallprocessdata = rightprocessres;
         for (let item of this.rightallprocessdata) {
            switch (item.name) {
               case "FPGA_Interface":
                  this.rightallprocessrearrangedata.FPGAInterface = (item.statename == "RUNNING" ? "UP" : "DOWN");
                  break;
               case "ai_aggregate":
                  this.rightallprocessrearrangedata.AiAggregate = (item.statename == "RUNNING" ? "UP" : "DOWN");
                  break;
               case "capture":
                  this.rightallprocessrearrangedata.Capture = (item.statename == "RUNNING" ? "UP" : "DOWN");
                  break;
               case "data_reduction":
                  this.rightallprocessrearrangedata.DataReduction = (item.statename == "RUNNING" ? "UP" : "DOWN");
                  break;
               case "drfits":
                  this.rightallprocessrearrangedata.Drfits = (item.statename == "RUNNING" ? "UP" : "DOWN");
                  break;
               case "image_reconstruction":
                  this.rightallprocessrearrangedata.ImageReconstruction = (item.statename == "RUNNING" ? "UP" : "DOWN");
                  break;
               case "recorder":
                  this.rightallprocessrearrangedata.Recorder = (item.statename == "RUNNING" ? "UP" : "DOWN");
                  break;
               case "webapi":
                  this.rightallprocessrearrangedata.Webapi = (item.statename == "RUNNING" ? "UP" : "DOWN");
                  break;
               case "webserver":
                  this.rightallprocessrearrangedata.Webserver = (item.statename == "RUNNING" ? "UP" : "DOWN");
                  break;
               default:
                  console.log("Invalid operator");
                  break;
            }
         }
      });

      this.spinnerService.hide();
   }

   onScreenClose() {
      this.router.navigate(['/admin/dashboard'])
   }

   ngOnDestroy() {
      if (this.id) {
         clearInterval(this.id);
      }
   }

   devicesIP() {
      // this.threatActivityService.getThreatActivities(sessionStorage.getItem('LOCAL_IP')).subscribe(res => {
      this.threatActivityService.getThreatActivities(environment.websocket_url.replace("ws://", "").replace(":9001/hello", "")).subscribe(res => {
         this.deviceService.getDevices().subscribe(deviceres => {
            if (deviceres['status'] == 200) {
               try {
                  this.device = deviceres["data"];
                  if (res['data']['#result-set-2'].length != 0) {
                     this.leftDevice = this.device.filter(a => a.macAddress == res['data']['#result-set-2'].filter(a => a.side == "left")[0]['mac_address'])[0];
                     this.rightDevice = this.device.filter(a => a.macAddress == res['data']['#result-set-2'].filter(a => a.side == "right")[0]['mac_address'])[0];
                     this.leftdeviceName = this.leftDevice.name;
                     this.rightdeviceName = this.rightDevice.name;

                     this.serviceStatus();
                  }
                  else {
                     this.leftdeviceName = "No Device";
                     this.rightdeviceName = "No Device";
                     this.spinnerService.hide();
                  }
               }
               catch {
                  this.spinnerService.hide();
               }
            }
         },
            err => {
               console.log("Error occurred: " + err.message);
            })
      },
      );
   }

   changeServiceStatus(serviceType: any, status: any) {
      this.spinnerService.show();
      if (serviceType == 'backend') {
         if (status == 'start') {
            this.stateService.changeServiceStatus("backend/start").subscribe(res => {
            },
               err => {
               })
         }
         else {
            this.stateService.changeServiceStatus("backend/stop").subscribe(res => {
            },
               err => {
               })
         }
      }
      else if (serviceType == 'logging') {
         if (status == 'start') {
            this.stateService.changeServiceStatus("logging/start").subscribe(res => {
            },
               err => {
               })
         }
         else {
            this.stateService.changeServiceStatus("logging/stop").subscribe(res => {
            },
               err => {
               })
         }
      }
      else if (serviceType == 'pipeline') {
         if (status == 'start') {
            this.stateService.changeServiceStatus("pipeline/start").subscribe(res => {
            },
               err => {
               })
         }
         else {
            this.stateService.changeServiceStatus("pipeline/stop").subscribe(res => {
            },
               err => {
               })
         }
      }

      this.spinnerService.hide();
      this.serviceStatus();
   }
}

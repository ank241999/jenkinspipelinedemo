import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class ShareDataService {
    private sharedData: any;
    private globalObject: any;
    openPopup: boolean = false;
    activityDashboardList: any;

    //session variables
    locale: string;
    currentUser: string;
    role: string;
    email: string;
    refreshToken: string;

    logoImageName: string;
    logoImagePath: string;
    footPrintImageName: string;
    footPrintImagePath: string;

    id: string;
    serverUrl: string;

    moduleName: string;

    constructor() {
    }

    public getSharedData(): any {
        return JSON.parse(localStorage.getItem("sharedData"));
    }

    public setSharedData(shared: any) {
        this.sharedData = shared;
        localStorage.setItem("sharedData", JSON.stringify(this.sharedData));
    }

    public getGlobalObject(): any {
        return JSON.parse(localStorage.getItem("globalObject"));
    }

    public setGlobalObject(global: any) {
        this.globalObject = global;
        localStorage.setItem("globalObject", JSON.stringify(this.globalObject));
    }

    public clearSessionVariables() {
        this.globalObject = null;
        this.openPopup = false;
        this.activityDashboardList = null;

        this.locale = null;
        this.currentUser = null;
        this.role = null;
        this.email = null;
        this.refreshToken = null;
        this.moduleName = null;

        // this.logoImageName = null;
        // this.logoImagePath = null;
        // this.footPrintImageName = null;
        // this.footPrintImagePath = null;

        this.id = null;
        // this.serverUrl = null;

        if (!environment.isMobile) {
            localStorage.removeItem("currentUser");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("email");
            localStorage.removeItem("shData");
        }
    }

    setApplicationVariables() {
        if (this.logoImagePath != null && this.logoImagePath != localStorage.getItem("logoImagePath")) {
            localStorage.setItem("logoImagePath", this.logoImagePath);
        }
        this.logoImagePath = localStorage.getItem("logoImagePath");

        if (environment.isMobile) {
            if (this.logoImageName != null && this.logoImageName != localStorage.getItem("logoImageName")) {
                localStorage.setItem("logoImageName", this.logoImageName);
            }
            if (this.footPrintImageName != null && this.footPrintImageName != localStorage.getItem("footPrintImageName")) {
                localStorage.setItem("footPrintImageName", this.footPrintImageName);
            }
            if (this.footPrintImagePath != null && this.footPrintImagePath != localStorage.getItem("footPrintImagePath")) {
                localStorage.setItem("footPrintImagePath", this.footPrintImagePath);
            }
            if (this.currentUser != null && this.currentUser != localStorage.getItem("currentUser")) {
                localStorage.setItem("currentUser", this.currentUser);
            }
            if (this.refreshToken != null && this.refreshToken != localStorage.getItem("refreshToken")) {
                localStorage.setItem("refreshToken", this.refreshToken);
            }
            if (this.email != null && this.email != localStorage.getItem("email")) {
                localStorage.setItem("email", this.email);
            }
            if (this.serverUrl != null && this.serverUrl != localStorage.getItem("serverUrl")) {
                localStorage.setItem("serverUrl", this.serverUrl);
            }
            if (this.locale != null && this.locale != localStorage.getItem("locale")) {
                localStorage.setItem("locale", this.locale);
            }
            if (this.role != null && this.role != localStorage.getItem("role")) {
                localStorage.setItem("role", this.role);
            }
            if (this.moduleName != null && this.moduleName != localStorage.getItem("moduleName")) {
                localStorage.setItem("moduleName", this.moduleName);
            }

            this.logoImageName = localStorage.getItem("logoImageName");
            this.footPrintImageName = localStorage.getItem("footPrintImageName");
            this.footPrintImagePath = localStorage.getItem("footPrintImagePath");
            this.currentUser = localStorage.getItem("currentUser");
            this.refreshToken = localStorage.getItem("refreshToken");
            this.email = localStorage.getItem("email");
            this.serverUrl = localStorage.getItem("serverUrl");
            this.locale = localStorage.getItem("locale");
            this.role = localStorage.getItem("role");
            this.moduleName = localStorage.getItem("moduleName");
        }
        else {
            if (this.currentUser != null) {
                let shData: any = {
                    "logoImageName": this.logoImageName, "logoImagePath": this.logoImagePath, "footPrintImageName": this.footPrintImageName,
                    "footPrintImagePath": this.footPrintImagePath, "currentUser": this.currentUser, "refreshToken": this.refreshToken, "email": this.email,
                    "serverUrl": this.serverUrl, "locale": this.locale, "role": this.role
                };
                localStorage.setItem("shData", CryptoJS.AES.encrypt(JSON.stringify(shData), "1234"));
            }
            else if (localStorage.getItem("shData") != null && this.currentUser == null) {
                let shData: any = CryptoJS.AES.decrypt(localStorage.getItem("shData"), "1234");
                let shValues: any = JSON.parse(shData.toString(CryptoJS.enc.Utf8));

                this.logoImageName = shValues.logoImageName;
                this.footPrintImageName = shValues.footPrintImageName;
                this.footPrintImagePath = shValues.footPrintImagePath;
                this.currentUser = shValues.currentUser;
                this.refreshToken = shValues.refreshToken;
                this.email = shValues.email;
                this.serverUrl = shValues.serverUrl;
                this.locale = shValues.locale;
                this.role = shValues.role;
                this.moduleName = shValues.moduleName;
            }
        }
    }
}
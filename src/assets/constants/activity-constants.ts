import { environment } from '../../environments/environment';
export class ActivityConstants {
    public static get leftThigh(): string { return "left thigh front"; }
    public static get leftThighBack(): string { return "left thigh back"; }
    public static get leftChest(): string { return "left chest front"; }
    public static get leftChestBack(): string { return "left chest back"; }
    public static get rightThigh(): string { return "right thigh front"; }
    public static get rightThighBack(): string { return "right thigh back"; }
    public static get rightChest(): string { return "right chest front"; }
    public static get rightChestBack(): string { return "right chest back"; }
    public static get leftHip(): string { return "left hip back"; }
    public static get leftHipFront(): string { return "left hip front"; }
    public static get rightHip(): string { return "right hip back"; }
    public static get rightHipFront(): string { return "right hip front"; }
    public static get centerLowerBack(): string { return "center lower back"; }
    public static get rightSculpa(): string { return "right scapula front"; }
    public static get rightSculpaBack(): string { return "right scapula back"; }
    public static get leftSculpa(): string { return "left scapula front"; }
    public static get leftSculpaBack(): string { return "left scapula back"; }
    public static get centerBack(): string { return "center back"; }
    public static get abdomen(): string { return "abdomen front"; }
    public static get abdomenBack(): string { return "abdomen back"; }
    public static get rightBackPocket(): string { return "right back pocket"; }
    public static get rightFrontPocket(): string { return "right front pocket"; }
    public static get leftBackPocket(): string { return "left back pocket"; }
    public static get leftFrontPocket(): string { return "left front pocket"; }
    public static get rightAnkle(): string { return "right ankle"; }
    public static get leftAnkle(): string { return "left ankle"; }

    //Depends on i18n translation
    public static get statusOk(): string { return "Ok"; }
    public static get statusAnomalies(): string { return "Anomalies"; }
    public static get statusThreat(): string { return "Threat"; }
    public static get fullDisplay(): string { return "full display"; }

    public static get smallNoThreatIcon(): string { return "../../assets/images/noThreatSmallDot-2.png"; }
    public static get largeNoThreatIcon(): string { return "../../assets/images/noThreatLargeDot.png"; }
    public static get smallAnomalyIcon(): string { return "../../assets/images/noThreatSmallDot-1.png"; }
    public static get largeAnomalyIcon(): string { return "../../assets/images/cautionLargeDot.png"; }
    public static get smallThreatIcon(): string { return "../../assets/images/noThreatSmallDot.png"; }
    public static get largeThreatIcon(): string { return "../../assets/images/threatLargeDot.png"; }
    public static get noImageIcon(): string { return "../../assets/images/noimage.png"; }

    public static get threatActivityCircle(): string { return "../../assets/images/Red_threat_Specific_Location_Circles@2x.png"; }
    public static get noThreatActivityCircle(): string { return "../../assets/images/nohreat.png"; }
    public static get anomalyActivityCircle(): string { return "../../assets/images/Yellow_Specific_Location_Circles@2x.png"; }

    public static get threatBorderImage(): string { return "../../assets/images/Red_BorderLine_Rectangle@2x.png"; }
    public static get noThreatBorderImage(): string { return "../../assets/images/Green_BorderLine_Rectangle@2x.png"; }
    public static get anomalyBorderImage(): string { return "../../assets/images/Yellow_BorderLine_Rectangle@2x.png"; }

    public static get threat(): string { return "txtThreat"; }
    public static get noThreat(): string { return "txtNoThreat"; }
    public static get anomaly(): string { return "anomaly"; }

    public static get threatNoObject(): string { return "No Objects On The Person Scanned"; }

    public static get threatCellphone(): string { return "Cellphone"; }
    public static get threatKeys(): string { return "Keys"; }

    public static get threatAnomaly(): string { return "Anomaly"; }

    public static get threatHandgun(): string { return "Handgun"; }
    public static get threatRifle(): string { return "Rifle"; }
    public static get threatPipebomb(): string { return "Pipebomb"; }
    public static get pipeBomblabel(): string { return "Pipe bomb"; }
    public static get threatKnife(): string { return "Knife"; }
    public static get threatThreat(): string { return "Threat"; }
    //i18n
    public static get browserLanguage(): string {
        if (environment.languagesSupported.find(a => a == navigator.language)) {
            return navigator.language;
        }
        else {
            return "en-US";
        }
    }
    //get locale
    public static getLocale(): string {
        let timeOffset: number = new Date().getTimezoneOffset();
        timeOffset = timeOffset * -1;
        let hour: number = Math.floor(timeOffset / 60);
        let minute: number = timeOffset % 60;
        let locale: string = hour + ":" + (minute < 0 ? minute * -1 : minute);
        if (timeOffset >= 0) {
            locale = "+" + hour + ":" + minute;
        }

        // localStorage.setItem("locale", locale);
        return locale
    }
    //retain required values
    public static retainRequiredValues() {
        let serverUrl: string = localStorage.getItem("serverUrl");
        let logoImagePath: string = localStorage.getItem("logoImagePath");
        let footPrintImagePath: string = localStorage.getItem("footPrintImagePath");
        let logoImageName: string = localStorage.getItem("logoImageName");
        let footPrintImageName: string = localStorage.getItem("footPrintImageName");

        localStorage.clear();

        localStorage.setItem("serverUrl", serverUrl);
        localStorage.setItem("logoImagePath", logoImagePath);
        localStorage.setItem("footPrintImagePath", footPrintImagePath);
        localStorage.setItem("logoImageName", logoImageName);
        localStorage.setItem("footPrintImageName", footPrintImageName);
    }

    public static arraySortByKey(array, key, order = "desc") {
        return array.sort(function (a, b) {
            var x = (order == "desc" ? a[key] : b[key]);
            var y = (order == "desc" ? b[key] : a[key]);
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        });
    }
}
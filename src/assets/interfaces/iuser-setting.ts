export interface IUserSetting {
    id?: string;
    locationId?: string;
    noThreatIndication?: string; //Minimal, Full - Incremental selector

    ctaColorNonMetalThreat?: string; //Call to action - Incremental selector
    ctaColorMetalThreat?: string; // Incremental selector
    ctaColorNonThreat?: string; // Incremental selector
    ctaColorAnomaly?: string;

    apSSID?: string; //Access point - Text Field
    apPassword?: string; //Access point - Text Field

    automaticEscalationTimeout?: string; // Beta
    language?: string; // Dropdown
    activeMonitoringDisplayTimeout?: string; //Incremental selector
    deviceName?: string; // System generated
    calibrationData?: string; //
    presets?: string; //Beta

    peopleCount?: string; //Ingress & Egress
    screenBrightness?: string;

    expirationDate?: string; //

    //stopThreatUpdate?: boolean;
    betaTestMode?: boolean;
    primaryGuardMode?: boolean;
    primaryDevice?: boolean;
    sendThreatsToHexwave?: boolean;
}

export interface IDashboardDetails {
    entranceID?: number;
    entranceName?: string;
    laneID?: number;
    laneName?: string;
    leftDeviceID?: number;
    leftDeviceName?: string;
    leftDeviceMacAddress?: string;
    leftDeviceSide?: string;
    leftTabletID?: string;
    leftDeviceStatus?: boolean;
    rightDeviceID?: number;
    rightDeviceName?: string;
    rightDeviceMacAddress?: string;
    rightDeviceSide?: string;
    rightTabletID?: string;
    rightDeviceStatus?: boolean;

    tabletId?: number;
    tabletName?: string;
    userName?: string;
    threatIcon?: string;
    threatType?: string;
    status?: string;
    id?: string;
    timestamp?: number;
    time?: string;
    guardName?: string;
}

export interface IDeviceDetails {
    threat_id?: number;
    log_id?: number;
    actual_result?: string;
    anomaly?: string;
    creation_date?: string;
    no_objects?: boolean;
    no_threat_config?: string;
    non_threat_cellphone?: string;
    non_threat_keys?: string;
    threat_handgun?: string;
    threat_pipe_bomb?: string;
    threat_knife?: string;
    threat_threat?: string;
    threat_rifle?: string;
    threat_status?: string;
    update_date?: string;
    left_devic_mac_address?: string;
    right_devic_mac_address?: string;
    creation_timestamp?: number;
    device_name?: string;
    lane_name?: string;
    gate_name?: string;
    time_in?: number;
    time_out?: number;
    tablet_mac_address?: string;
    tablet_name?: string;
    user_name?: string;
    is_viewed?: boolean;
}

export interface IThreatDetails {
    threatIcon?: string;
    threatType?: string;
    creation_timestamp?: string;
    time: string;
    user_name?: string;
    tablet_name?: string;
}

export class ThreatDetails {
    constructor(public threatIcon: string, public threatType: string, public creation_timestamp: string, public time: string,
        public user_name: string, public tablet_name: string) {
    }
}
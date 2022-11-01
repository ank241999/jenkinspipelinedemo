export interface IStateMonitoring {
    Report?: IHealthResponse,
    DeviceSetting?: IHealthResponse,
    UserSetting?: IHealthResponse,
    AISimulatorFrontend?: IHealthResponse,
    AISimulatorBackend?: IHealthResponse,
    ActiveMonitorBackend?: IHealthResponse,
    Auth?: IHealthResponse,
    DeviceDetect?: IHealthResponse,
    Adminer?: IHealthResponse,
    Keycloak?: IHealthResponse,
    ActiveMonitorFrontend?: IHealthResponse,
    HexwaveLog?: IHealthResponse,
    Kong?: IHealthResponse,
    Peripheral?: IHealthResponse,
    Kibana?: IHealthResponse,
    Prometheus?: IHealthResponse,
    Grafana?: IHealthResponse,
    ElasticSearch?: IHealthResponse,
    Fluentd?: IHealthResponse,
    db?: IHealthResponse
}

export interface IHealthResponse {
    status?: string,
    details?: any
}

export interface IAllProcessResponse {
    description?: string,
    pid?: number,
    stderr_logfile?: string,
    stop?: number,
    logfile?: string,
    exitstatus?: number,
    spawnerr?: string,
    now?: number,
    group?: string,
    name?: string,
    statename?: string,
    start?: number,
    state?: number,
    stdout_logfile?: string
}

export interface IAllProcessRearrange {
    FPGAInterface?: string,
    AiAggregate?: string,
    Capture?: string,
    DataReduction?: string,
    Drfits?: string,
    ImageReconstruction?: string,
    Recorder?: string,
    Webapi?: string,
    Webserver?: string
}
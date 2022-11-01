export interface ICountry {
    isoCode: string;
    name: string;
    phonecode: string;
    flag:string;
    currency: string;
    latitude: number;
    longitude: number;
    timezones: ITimezones[];
}

export interface ITimezones{
    zoneName: string;
    gmtOffset: number;
    gmtOffsetName: string;
    abbreviation: string;
    tzName: string;
}

export interface IState{
    name: string;
    isoCode: string;
    countryCode: string;
    latitude: number;
    longitude: number;
}

export interface ICity{
    name: string;
    countryCode: string;
    stateCode: string;
    latitude: number;
    longitude: number;
}
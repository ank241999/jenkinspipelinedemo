import { IRole } from './irole';

export interface IUser {
    id?: string,
    email?: string,
    password?: string,
    firstName?: string,
    lastName?: string,
    loggedIn?: boolean,
    loggedInDevice?: string,
    expiryTimestamp?: number,
    creationTimestamp?: string,
    expirydate?: string,

    _rev?: string,
    device?: string,
    role?: any,
    expiryDays?: number,
    roleName?: string,
    expiryDate?: number

    isAgree?: boolean,
    languageCode?: string
}

export interface IUserAgreement {
    id?: string,
    isAgree?: boolean,
    languageCode?: string
}
export interface IAuth {
    jti?: string;
    exp?: number;
    nbf?: number;
    iat?: number;
    iss?: string,
    aud?: string;
    sub?: string;
    typ?: string;
    azp?: string;
    auth_time?: number;
    session_state?: string;
    preferred_username?: string;
    email?: string;
    email_verified?: boolean;
    acr?: number;
    allowed_origins?: string[];
    realm_access?: any;
    resource_access?: any;
    scope?: string;
    user_name?: string;
    client_id?: string;
    username?: string;
    active?: boolean;
}

export class Auth {
    jti?: string;
    exp?: number;
    nbf?: number;
    iat?: number;
    iss?: string;
    aud?: string;
    sub?: string;
    typ?: string;
    azp?: string;
    auth_time?: number;
    session_state?: string;
    preferred_username?: string;
    email?: string;
    email_verified?: boolean;
    acr?: number;
    allowed_origins?: string[];
    realm_access?: any;
    resource_access?: any;
    scope?: string;
    user_name?: string;
    client_id?: string;
    username?: string;
    active?: boolean;

    constructor(authData) {
        this.jti= authData.jti;
        this.exp= authData.exp;
        this.nbf= authData.nbf;
        this.iat= authData.iat;
        this.iss= authData.iss,
        this.aud= authData.aud;
        this.sub= authData.sub;
        this.typ= authData.typ;
        this.azp= authData.azp;
        this.auth_time= authData.auth_time;
        this.session_state= authData.session_state;
        this.preferred_username= authData.preferred_username;
        this.email= authData.email;
        this.email_verified= authData.email_verified;
        this.acr= authData.acr;
        this.allowed_origins= authData.allowed_origins;
        this.realm_access= authData.realm_access;
        this.resource_access= authData.resource_access;
        this.scope= authData.scope;
        this.user_name= authData.user_name;
        this.client_id= authData.client_id;
        this.username= authData.username;
        this.active= authData.active;
    }
}
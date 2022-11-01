import { Injectable } from '@angular/core';

@Injectable()
export class ApplicationDataService {
    private token: string;
    private refreshToken: string;
    constructor() {
    }

    public getToken(): string {
        return this.token;
    }

    public getRefreshTokena(): string {
        return this.refreshToken;
    }

    public setToken(token: string) {
        this.token = token;
    }

    public setRefreshToken(refreshToken: string) {
        this.token = refreshToken;
    }
}
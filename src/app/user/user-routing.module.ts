import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent} from './register/register.component';
import { AlreadyloginComponent } from './alreadylogin/alreadylogin.component';
import { AlreadyloginalertComponent } from './alreadyloginalert/alreadyloginalert.component';
import { RegisteragainComponent } from './registeragain/registeragain.component';
import { ServerURLComponent } from './login/server-url/server-url.component';
import { TermsComponent } from './terms/terms.component';
import { IntermediateComponent } from './login/intermediate.component';

const routes: Routes = [
    {
        path: '',
        component: IntermediateComponent,
        data: {
            title: 'Intermediate'
        },
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent,
        data: {
            title: 'Login'
        },
        pathMatch: 'full'
    },
    {
        path: 'alreadylogin',
        component: AlreadyloginComponent,
        data: {
            title: 'Login'
        },
        pathMatch: 'full'
    },
    {
        path: 'alreadyloginalert',
        component: AlreadyloginalertComponent,
        data: {
            title: 'Login'
        },
        pathMatch: 'full'
    },
    {
        path: 'register',
        component: RegisterComponent,
        data: {
            title: 'User Registration'
        },
        pathMatch: 'full'
    },
    {
        path: 'registeragain',
        component: RegisteragainComponent,
        data: {
            title: 'Login'
        },
        pathMatch: 'full'
    },
    {
        path: 'serverurl',
        component: ServerURLComponent,
        data: {
            title: 'serverurl'
        },
        pathMatch: 'full'
    },
    {
        path: 'terms',
        component: TermsComponent,
        data: {
            title: 'terms'
        },
        pathMatch: 'full'
    }    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule { }

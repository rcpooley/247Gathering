import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./components/home/home.component";
import {RegisterComponent} from "./components/register/register.component";
import {AboutUsComponent} from "./components/about-us/about-us.component";
import {ContactComponent} from "./components/contact/contact.component";
import {HomeMainComponent} from "./components/home-main/home-main.component";
import {AdminHomeComponent} from "./components/admin-home/admin-home.component";
import {AdminUsersComponent} from "./components/admin-users/admin-users.component";
import {AdminGatheringsComponent} from "./components/admin-gatherings/admin-gatherings.component";

const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {
        path: 'home',
        component: HomeComponent,
        children: [
            {path: '', component: HomeMainComponent},
            {path: 'register', component: RegisterComponent},
            {path: 'about', component: AboutUsComponent},
            {path: 'contact', component: ContactComponent}
        ]
    },
    {
        path: 'admin',
        component: AdminHomeComponent,
        children: [
            {path: '', redirectTo: 'users', pathMatch: 'full'},
            {path: 'users', component: AdminUsersComponent},
            {path: 'gatherings', component: AdminGatheringsComponent}
        ]
    },
    {path: '**', redirectTo: 'home'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}

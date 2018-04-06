import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./components/home/home.component";
import {RegisterComponent} from "./components/register/register.component";
import {AboutUsComponent} from "./components/about-us/about-us.component";
import {ContactComponent} from "./components/contact/contact.component";
import {HomeMainComponent} from "./components/home-main/home-main.component";

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
    {path: '**', redirectTo: 'home/register'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}

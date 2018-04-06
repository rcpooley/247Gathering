import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./components/home/home.component";
import {RegisterComponent} from "./components/register/register.component";
import {AboutUsComponent} from "./components/about-us/about-us.component";

const routes: Routes = [
    {path: '', redirectTo: 'home/register', pathMatch: 'full'},
    {
        path: 'home',
        component: HomeComponent,
        children: [
            {path: '', redirectTo: 'register', pathMatch: 'full'},
            {path: 'register', component: RegisterComponent},
            {path: 'about', component: AboutUsComponent}
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

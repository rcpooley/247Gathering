import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './components/app/app.component';
import {CoreService} from './services/core.service';
import {RegisterComponent} from './components/register/register.component';
import {FormsModule} from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { HomeNavbarComponent } from './components/home-navbar/home-navbar.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {AppRoutingModule} from "./app-routing.module";
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ContactComponent } from './components/contact/contact.component';
import { HomeMainComponent } from './components/home-main/home-main.component';

@NgModule({
    declarations: [
        AppComponent,
        RegisterComponent,
        HomeComponent,
        HomeNavbarComponent,
        AboutUsComponent,
        ContactComponent,
        HomeMainComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        NgbModule.forRoot(),
        AppRoutingModule
    ],
    providers: [CoreService],
    bootstrap: [AppComponent]
})
export class AppModule {
}

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
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { AdminNavbarComponent } from './components/admin-navbar/admin-navbar.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { AdminGatheringsComponent } from './components/admin-gatherings/admin-gatherings.component';
import { AdminSongsComponent } from './components/admin-songs/admin-songs.component';
import { AdminSongSelectComponent } from './components/admin-song-select/admin-song-select.component';

@NgModule({
    declarations: [
        AppComponent,
        RegisterComponent,
        HomeComponent,
        HomeNavbarComponent,
        AboutUsComponent,
        ContactComponent,
        HomeMainComponent,
        AdminHomeComponent,
        AdminNavbarComponent,
        AdminUsersComponent,
        AdminGatheringsComponent,
        AdminSongsComponent,
        AdminSongSelectComponent
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

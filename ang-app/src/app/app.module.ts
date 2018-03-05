import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './components/app/app.component';
import {CoreService} from './services/core.service';
import {RegisterComponent} from './components/register/register.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


@NgModule({
    declarations: [
        AppComponent,
        RegisterComponent
    ],
    imports: [
        BrowserModule,
        FormsModule
    ],
    providers: [CoreService],
    bootstrap: [AppComponent]
})
export class AppModule {
}

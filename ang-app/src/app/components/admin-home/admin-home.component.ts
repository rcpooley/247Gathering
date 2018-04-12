import {Component} from '@angular/core';
import {CoreService} from "../../services/core.service";

@Component({
    selector: 'admin-home',
    templateUrl: './admin-home.component.html',
    styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent {

    public password: string;

    constructor(public core: CoreService) {
        this.password = '';
    }

    login() {
        this.core.adminLogin(this.password);
        this.password = '';
    }

    logout() {
        this.password = '';
        this.core.adminLogin(this.password);
    }
}

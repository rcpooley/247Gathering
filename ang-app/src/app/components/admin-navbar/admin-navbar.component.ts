import {Component} from '@angular/core';
import {CoreService} from "../../services/core.service";

@Component({
    selector: 'admin-navbar',
    templateUrl: './admin-navbar.component.html',
    styleUrls: ['./admin-navbar.component.css']
})
export class AdminNavbarComponent {

    constructor(private core: CoreService) {
    }

    logout() {
        this.core.adminLogin('');
    }
}

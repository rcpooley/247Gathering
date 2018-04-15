import {Component} from '@angular/core';
import {CoreService} from "../../services/core.service";

interface NavItem {
    link: string;
    name: string;
}

@Component({
    selector: 'admin-navbar',
    templateUrl: './admin-navbar.component.html',
    styleUrls: ['./admin-navbar.component.css']
})
export class AdminNavbarComponent {

    navItems: NavItem[];

    constructor(private core: CoreService) {
        this.navItems = [
            {
                link: './users',
                name: 'Users'
            },
            {
                link: './gatherings',
                name: 'Gatherings'
            },
            {
                link: './songs',
                name: 'Songs'
            }
        ];
    }

    logout() {
        this.core.adminLogin('');
    }
}

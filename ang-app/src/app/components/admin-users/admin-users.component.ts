import {Component, OnInit} from '@angular/core';
import {CoreService} from "../../services/core.service";
import {User} from "247-core/src/interfaces/user";

@Component({
    selector: 'admin-users',
    templateUrl: './admin-users.component.html',
    styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {

    private users: User[];

    constructor(private core: CoreService) {
        this.users = null;
    }

    ngOnInit() {
        this.core.adminGetUsers((users: User[]) => {
            this.users = users;
        });
    }

}

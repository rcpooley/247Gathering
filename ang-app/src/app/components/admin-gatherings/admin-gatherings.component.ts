import {Component, OnInit} from '@angular/core';
import {CoreService} from "../../services/core.service";
import {Gathering} from "247-core/src/interfaces/gathering";
import {User} from "247-core/src/interfaces/user";

@Component({
    selector: 'admin-gatherings',
    templateUrl: './admin-gatherings.component.html',
    styleUrls: ['./admin-gatherings.component.css']
})
export class AdminGatheringsComponent implements OnInit {

    private gatherings: Gathering[];
    private users: {[userID: number]: User};

    constructor(private core: CoreService) {
        this.gatherings = null;
        this.users = null;
    }

    ngOnInit() {
        this.core.adminGetGatherings((gatherings: Gathering[]) => {
            this.gatherings = gatherings;
        });
        this.core.adminGetUsers((users: User[]) => {
            this.users = {};
            users.forEach(user => {
                this.users[user.id] = user;
            });
        });
    }

}

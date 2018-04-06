import {Component, OnInit} from '@angular/core';
import {CoreService} from "../../services/core.service";
import {User} from "247-core/dist/interfaces/packets";

@Component({
    selector: 'home-main',
    templateUrl: './home-main.component.html',
    styleUrls: ['./home-main.component.css']
})
export class HomeMainComponent implements OnInit {

    checkInQuery: string;
    searchUsersTimeout: any;
    userList: User[];

    constructor(private core: CoreService) {
        this.checkInQuery = '';
        this.userList = null;
        this.userList = [{id: 1, firstName: 'Allen', lastName: 'Beeman'},
            {id: 1, firstName: 'Robert', lastName: 'Pooley'}];
    }

    ngOnInit() {
    }

    checkInTick() {
        this.userList = null;
        clearTimeout(this.searchUsersTimeout);
        this.searchUsersTimeout = setTimeout(() => {
            this.doSearchUsers();
        }, 500);
    }

    doSearchUsers() {
        if (this.checkInQuery.length > 0) {
            this.core.searchUsers({query: this.checkInQuery}, users => {
                this.userList = users;
            });
        }
    }

    goRegister() {
        this.core.tmpName = this.checkInQuery;
    }
}

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

    doCheckIn(userID: number) {
        this.core.checkInUser(userID, resp => {
            if (resp.success) {
                this.userList.forEach(user => {
                    user.checkedIn = true;
                });
            }
        });
    }

    isCheckedIn(user: User) {
        return user.checkedIn;
    }
}

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
    private users: { [userID: number]: User };
    private weekDays: string[];

    editingSongs: boolean = true;

    constructor(private core: CoreService) {
        this.weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    }

    ngOnInit() {
        this.fetchAll();
    }

    private fetchAll() {
        this.gatherings = null;
        this.users = null;
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

    minsToStr(mins: number): string {
        let d = new Date(mins * 60 * 1000);

        let hours = ((d.getHours() + 11) % 12 + 1);
        let minsStr = d.getMinutes() + '';
        if (minsStr.length < 2) minsStr = '0' + minsStr;

        let suffix = d.getHours() >= 12 ? 'pm' : 'am';

        return (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear() + ' ' + this.weekDays[d.getDay()] + ', ' + hours + ':' + minsStr + ' ' + suffix;
    }

    private nextGatheringMins() {
        let d = new Date();
        let daysToAdd = 5 - d.getDay();
        if (daysToAdd < 0) daysToAdd += 7;

        let curHour = Math.floor(d.getTime() / (1000 * 60 * 60));

        d = new Date((curHour + daysToAdd * 24) * 60 * 60 * 1000);
        d.setHours(19);

        return Math.floor(d.getTime() / (1000 * 60));
    }

    newGathering() {
        let nowMins = Math.floor(Date.now() / (1000 * 60));
        if (nowMins < this.gatherings[this.gatherings.length - 1].time) {
            alert('Cannot create a new gathering until the current gathering has passed');
            return;
        }

        this.core.adminNewGathering(this.nextGatheringMins(), () => {
            this.fetchAll();
        });
    }
}

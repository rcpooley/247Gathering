import {Component, OnInit} from '@angular/core';
import {CoreService} from '../../services/core.service';
import {PacketRegister, PacketSettings} from '247-core/dist/interfaces/packets';
import {Entry} from "247-core/dist/interfaces/entry";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    regForm: PacketRegister;
    regSettings: PacketSettings;

    constructor(public core: CoreService) {
        this.regForm = {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            howhear: -1,
            howhearOther: '',
            ministry: -1,
            ministryOther: '',
            greek: -1,
            greekOther: '',
        };
    }

    ngOnInit(): void {
        this.core.getSettings((settings: PacketSettings) => {
            let keys = Object.keys(settings);
            for (let i = 0; i < keys.length; i++) {
                let arr: Entry[] = settings[keys[i]];
                arr.sort((a: Entry, b: Entry) => {
                    if (a.id == -1) return 1;
                    return a.id - b.id;
                });
            }

            this.regForm.howhear = settings.hearOpts[0].id;
            this.regForm.ministry = settings.ministryOpts[0].id;
            this.regForm.greek = settings.greekOpts[0].id;
            this.regSettings = settings;
        });
    }

    getIndexes(arr: any[]) {
        if (!arr) {
            return [];
        }
        let nums = [];
        for (let i = 0; i < arr.length; i++) {
            nums.push(i);
        }
        return nums;
    }

    onSubmit() {
        this.core.registerUser(this.regForm);
    }
}

import {Component, OnInit} from '@angular/core';
import {CoreService} from '../../services/core.service';

interface DataSetting {
    id: number;
    name: string;
}

interface RegSettings {
    hearOpts: DataSetting[];
    ministryOpts: DataSetting[];
    greekOpts: DataSetting[];
}

interface OtherOpts {
    hearOpts: boolean;
    ministryOpts: boolean;
    greekOpts: boolean;
}

interface RegForm {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    howhear?: number;
    howhearOther?: string;
    greek?: number;
    greekOther?: string;
    ministry?: number;
    ministryOther?: string;
}

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    regForm: RegForm;
    regSettings: RegSettings;
    showOther: OtherOpts;

    constructor(public core: CoreService) {
        this.showOther = {
            hearOpts: false,
            ministryOpts: false,
            greekOpts: false
        };
        this.regForm = {};
    }

    ngOnInit(): void {
        let storeSettings = this.core.getSettingsStore();

        storeSettings.ref('/').on('update', value => {
            if (!value) {
                return;
            }
            this.regSettings = value;
            if (this.regSettings.hearOpts)
                this.regForm.howhear = this.regSettings.hearOpts[0].id;
            if (this.regSettings.greekOpts)
                this.regForm.greek = this.regSettings.greekOpts[0].id;
            if (this.regSettings.ministryOpts)
                this.regForm.ministry = this.regSettings.ministryOpts[0].id;
        }, true);
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

    onDropdownChange(idx, key: string) {
        this.showOther[key] = (idx === this.regSettings[key].length);
    }

    onSubmit() {
        this.core.registerUser(this.regForm.firstName, this.regForm.lastName, this.regForm.email,
            this.regForm.phone, this.regForm.howhear, this.regForm.howhearOther,
            this.regForm.greek, this.regForm.greekOther, this.regForm.ministry, this.regForm.ministryOther);
    }
}

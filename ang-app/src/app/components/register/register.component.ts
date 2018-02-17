import {Component, OnInit} from '@angular/core';
import {CoreService} from '../../services/core.service';

interface SelectOpt {
    text: string;
    selected: boolean;
}

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    involveOpts: SelectOpt[];

    hearOpts: string[];
    showHearOther: boolean;

    constructor(public core: CoreService) {
        this.involveOpts = [];
        this.hearOpts = [];
    }

    ngOnInit(): void {
        let storeSettings = this.core.getSettingsStore();

        storeSettings.ref('/involvement').on('update', value => {
            if (!value) {
                return;
            }
            this.involveOpts = value.map(txt => {
                return {
                    text: txt,
                    selected: false
                };
            });
        });

        storeSettings.ref('/hearaboutus').on('update', value => {
            this.hearOpts = value;
        });
    }

    getIndexes(arr: any[]) {
        let nums = [];
        for (let i = 0; i < arr.length; i++) {
            nums.push(i);
        }
        return nums;
    }

    toggleOpt(idx: number) {
        this.involveOpts[idx].selected = !this.involveOpts[idx].selected;
    }

    onHowHearChange(idx) {
        this.showHearOther = (idx === this.hearOpts.length);
    }
}

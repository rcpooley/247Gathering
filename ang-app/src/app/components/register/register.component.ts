import {Component, OnInit} from '@angular/core';
import {CoreService} from '../../services/core.service';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';

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

    form: FormGroup;
    errors: any;

    involveOpts: SelectOpt[];

    hearOpts: string[];
    showHearOther: boolean;

    greeek = ['Theta Xi', 'Kappa Alpha'];

    constructor(public core: CoreService, private fb: FormBuilder) {
        this.involveOpts = [];
        this.hearOpts = [];
    }

    ngOnInit(): void {
        this.form = new FormGroup({
            firstName: this.fb.group({
                firstNameCtrl: ['', Validators.required]
            }),
            lastName: this.fb.group({
                lastNameCtrl: ['', Validators.required]
            })
        });
        this.errors = {lastName: {lastNameCtrl: ''}};

        this.form.valueChanges.subscribe((e) => {
            this.updateErrors();
        });

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

    updateErrors() {
        this.updateErrorsHelper(this.form, this.errors);

        /* <ng-container *ngIf="form.controls.firstName.controls.firstNameCtrl as ctrl">
         <div *ngIf="ctrl.invalid && (ctrl.dirty || ctrl.touched)" class="alert alert-danger">
         <div *ngIf="ctrl.errors.required">
             First name is required
         </div>
         </div>
         </ng-container>*/
    }

    private updateErrorsHelper(group: any, errObj: any) {
        if (group.controls) {
            Object.keys(group).forEach(key => {
                if (!(key in errObj)) {
                    errObj[key] = {};
                }
                this.updateErrorsHelper(group.controls[key], errObj[key]);
            });
        } else {
            let errHtml = '';
            if (group.invalid && (group.dirty || group.touched)) {

            }
        }
    }

    onSubmit() {
        console.log(this.form);
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

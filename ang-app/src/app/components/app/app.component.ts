import {Component} from '@angular/core';
import {CoreService} from '../../services/core.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'app';

    constructor(private core: CoreService) {
    }

}

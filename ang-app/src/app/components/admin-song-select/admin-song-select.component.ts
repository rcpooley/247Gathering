import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CoreService} from "../../services/core.service";
import {Gathering} from "247-core/src/interfaces/gathering";
import {Song} from "247-core/src/interfaces/song";
import {GatheringSong} from "247-core/src/interfaces/gatheringSong";

@Component({
    selector: 'admin-song-select',
    templateUrl: './admin-song-select.component.html',
    styleUrls: ['./admin-song-select.component.css']
})
export class AdminSongSelectComponent implements OnInit {

    gathering: Gathering;
    songs: Song[];
    curSong: GatheringSong;
    @Output() finished = new EventEmitter();

    constructor(private core: CoreService) {
        this.gathering = null;
        this.songs = null;
        this.curSong = null;
    }

    ngOnInit() {
        this.core.adminGetGatherings(gatherings => {
            this.gathering = gatherings[gatherings.length - 1];
        });
        this.core.adminGetSongs(songs => {
            this.songs = songs;
        });
    }

    done() {
        this.finished.emit(true);
    }

    mMove(e) {
        if (this.curSong == null) return;

        let my = e.clientY;

        let container = document.getElementById('currentSongs');
        let items = container.getElementsByClassName('songItem');

        let idx;
        for (idx = 0; idx < items.length; idx++) {
            let rect = items[idx].getBoundingClientRect();
            let mid = rect.bottom;
            console.log(idx, mid, my);
            if (my >= mid) {
                break;
            }
        }
        if (idx == items.length) return;

        let curIdx = this.gathering.songs.indexOf(this.curSong);
        if (curIdx != idx) {
            this.gathering.songs.splice(curIdx, 1);
            this.gathering.songs.splice(idx, 0, this.curSong);
        }
    }

    mDown(e, song) {
        this.curSong = song;
    }

    mUp(e, song) {
        this.curSong = null;
    }
}

import {Component, OnInit} from '@angular/core';
import {CoreService} from "../../services/core.service";
import {Song} from "247-core/src/interfaces/song";

@Component({
    selector: 'admin-songs',
    templateUrl: './admin-songs.component.html',
    styleUrls: ['./admin-songs.component.css']
})
export class AdminSongsComponent implements OnInit {

    songs: Song[];

    newSongTitle: string;

    constructor(private core: CoreService) {
        this.newSongTitle = '';
    }

    ngOnInit() {
        this.fetchAll();
    }

    private fetchAll() {
        this.songs = null;
        this.core.adminGetSongs(songs => {
            this.songs = songs;
        });
    }

    addSong() {
        if (this.newSongTitle.length == 0) {
            alert('Song cannot have an empty name!');
            return;
        }

        this.core.adminAddSong(this.newSongTitle, () => {
            this.fetchAll();
        });
        this.newSongTitle = '';
    }
}

import {GatheringSong} from "./gatheringSong";

export interface Gathering {
    id: number;
    time: number;
    users?: number[];
    songs?: GatheringSong[];
}
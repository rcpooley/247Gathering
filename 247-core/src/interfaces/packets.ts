import {Entry} from './entry';

export interface PacketSettings {
    greekOpts: Entry[];
    ministryOpts: Entry[];
    hearOpts: Entry[];
}

export interface PacketRegister {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    howhear: number;
    howhearOther: string;
    ministry: number;
    ministryOther: string;
    greek: number;
    greekOther: string;
}
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

export interface PacketSearchUsers {
    query: string;
}

export interface User {
    id: number;
    firstName: string;
    lastName: string;
}

export interface PacketSearchUsersResponse {
    users: User[];
}

export interface PacketCheckIn {
    userID: number;
}

export interface PacketResponse {
    success: boolean;
}
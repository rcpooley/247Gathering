export interface User {
    id: number;
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
    checkedIn?: boolean;
}

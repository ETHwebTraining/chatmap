export interface CurrentLocation {
    lat: number;
    lng: number;
}

export interface UserProfile {
    id?: string;
    displayName: string;
    photoURL: string;
    email: string;
}

export interface Place {
    id?: string;
    name: string;
    loc?: CurrentLocation;
    pos?: any;
    userId: string;
}

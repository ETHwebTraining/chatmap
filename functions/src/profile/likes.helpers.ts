import * as admin from 'firebase-admin';
import { PlaceLike, UserProfile } from '../../../src/app/models/user.model';

const afs = admin.firestore();

export async function onLiked(data, context) {
    const like = data.data() as PlaceLike;

    const userRef = afs.doc(`users/${like.userId}`);

    return afs.runTransaction(async (t) => {
        const user = (await t.get(userRef)).data() as UserProfile;

        const userUpdate: UserProfile = {
            ...user,
            placesLiked: user.placesLiked + 1
        };

        t.update(userRef, userUpdate);
        return t;
    });
}


export async function onUnLiked(data, context) {
    const like = data.data() as PlaceLike;

    const userRef = afs.doc(`users/${like.userId}`);

    return afs.runTransaction(async (t) => {
        const user = (await t.get(userRef)).data() as UserProfile;

        const userUpdate: UserProfile = {
            ...user,
            placesLiked: user.placesLiked - 1
        };

        t.update(userRef, userUpdate);
        return t;
    });
}

import { Discovery, UserProfile } from './../../../src/app/models/user.model';
import * as admin from 'firebase-admin';
admin.initializeApp();

const afs = admin.firestore();

export async function onDiscovered(data, context) {
    const discovery = data.data() as Discovery;

    const userRef = afs.doc(`users/${discovery.userId}`);

    return afs.runTransaction(async (t) => {
        const user = (await t.get(userRef)).data() as UserProfile;

        const userUpdate: UserProfile = {
            ...user,
            placesDiscovered: user.placesDiscovered + 1
        };

        t.update(userRef, userUpdate);
        return t;
    });
}

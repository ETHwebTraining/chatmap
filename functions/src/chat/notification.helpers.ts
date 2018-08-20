import { PlaceLike } from './../../../src/app/models/user.model';
import * as admin from 'firebase-admin';
import { AppMessage } from '../../../src/app/models/user.model';

import flatten = require('lodash/flatten');


const messaging = admin.messaging();
const afs = admin.firestore();

export async  function onNewMessage(data, context) {
    const message = data.data() as AppMessage;
    const placeId = context.params.placeId;

    const likesRef = afs.collection('likes').where('placeId', '==', placeId);
    let tokens = [];

    await  afs.runTransaction(async (t) => {

        const likesQry = (await t.get(likesRef)).docs;
        const userIds = likesQry.map(doc => (doc.data() as PlaceLike).userId);
        const devicesQry = await Promise.all (userIds.map(async id => (await getuserDevices(id, t))));

        const devicessnap = flatten(devicesQry);
        const recipients = devicessnap.filter(doc => doc.data().userId !== message.userId);
        tokens = devicessnap.map(doc => doc.data().token as string);

        return t;
    });

    const payload: admin.messaging.MessagingPayload = {
            notification : {
              body : `New message in ${message.placeName}`,
              title : `${message.displayName}: ${message.content.slice(0, 10)}`,
              }
    };

    console.log ('the tokens ', tokens);

    if (!tokens.length) { return null; }

    return messaging.sendToDevice(tokens, payload)
    .then(() => console.log('notifs sent'));
}


async function getuserDevices(userId: string, t: FirebaseFirestore.Transaction) {
    return (await t.get(afs.collection('devices').where('userId', '==', userId))).docs;
}

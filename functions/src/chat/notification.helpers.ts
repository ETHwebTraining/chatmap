import { PlaceLike } from './../../../src/app/models/user.model';
import * as admin from 'firebase-admin';
import { AppMessage } from '../../../src/app/models/user.model';
import * as emoji from 'node-emoji';




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
        tokens = recipients.map(doc => doc.data().token as string);

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


export async function onSanitize(data, context) {
    const map = emoji.emoji.world_map;
    const peach = emoji.emoji.peach;
    const poop = emoji.emoji.poop;
    const flower = emoji.emoji.white_flower;

    const message = data.data() as AppMessage;
    const text = message.content;

    const placeId = context.params.placeId;
    const messageId = context.params.messageId;



    const msgRef = afs.doc(`places/${placeId}/messages/${messageId}`);
    const words = ['fuck', 'shit', 'ass', 'map'];
    const newText = words.map(word => replaceWords(word, text))[words.length - 1];

    console.log('the new text ', newText);
    return msgRef.update({content: newText});
}


async function getuserDevices(userId: string, t: FirebaseFirestore.Transaction) {
    return (await t.get(afs.collection('devices').where('userId', '==', userId))).docs;
}


function replaceWords(word: string, str: string ) {

    let newStr = '';

    const map = emoji.emoji.world_map;
    const peach = emoji.emoji.peach;
    const poop = emoji.emoji.poop;
    const flower = emoji.emoji.white_flower;


    console.log('the current word ', word);
    switch (word) {
        case 'fuck': {
            newStr = str.replace(/\bfuck\b/g, flower);
           break;
        }
        case 'shit': {
            newStr = str.replace(/\bshit\b/g, poop);
           break;
        }
        case 'ass': {
            newStr = str.replace(/\bass\b/g, peach);
           break;
        }
        case 'map': {
            newStr = str.replace(/\bmap\b/g, map);
            break;
        }
    }

    console.log('the transformed str ', newStr);
     return newStr;
}

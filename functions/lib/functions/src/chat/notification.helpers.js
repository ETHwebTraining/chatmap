"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const emoji = require("node-emoji");
const flatten = require("lodash/flatten");
const messaging = admin.messaging();
const afs = admin.firestore();
function onNewMessage(data, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const message = data.data();
        const placeId = context.params.placeId;
        const likesRef = afs.collection('likes').where('placeId', '==', placeId);
        let tokens = [];
        yield afs.runTransaction((t) => __awaiter(this, void 0, void 0, function* () {
            const likesQry = (yield t.get(likesRef)).docs;
            const userIds = likesQry.map(doc => doc.data().userId);
            const devicesQry = yield Promise.all(userIds.map((id) => __awaiter(this, void 0, void 0, function* () { return (yield getuserDevices(id, t)); })));
            const devicessnap = flatten(devicesQry);
            const recipients = devicessnap.filter(doc => doc.data().userId !== message.userId);
            tokens = recipients.map(doc => doc.data().token);
            return t;
        }));
        const payload = {
            notification: {
                body: `New message in ${message.placeName}`,
                title: `${message.displayName}: ${message.content.slice(0, 10)}`,
            }
        };
        console.log('the tokens ', tokens);
        if (!tokens.length) {
            return null;
        }
        return messaging.sendToDevice(tokens, payload)
            .then(() => console.log('notifs sent'));
    });
}
exports.onNewMessage = onNewMessage;
function onSanitize(data, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const map = emoji.emoji.world_map;
        const peach = emoji.emoji.peach;
        const poop = emoji.emoji.poop;
        const flower = emoji.emoji.white_flower;
        const message = data.data();
        const text = message.content;
        const placeId = context.params.placeId;
        const messageId = context.params.messageId;
        const msgRef = afs.doc(`places/${placeId}/messages/${messageId}`);
        const words = ['fuck', 'shit', 'ass', 'map'];
        const newText = words.map(word => replaceWords(word, text))[words.length - 1];
        console.log('the new text ', newText);
        return msgRef.update({ content: newText });
    });
}
exports.onSanitize = onSanitize;
function getuserDevices(userId, t) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield t.get(afs.collection('devices').where('userId', '==', userId))).docs;
    });
}
function replaceWords(word, str) {
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
//# sourceMappingURL=notification.helpers.js.map
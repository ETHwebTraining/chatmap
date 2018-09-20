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
const afs = admin.firestore();
function onLiked(data, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const like = data.data();
        const userRef = afs.doc(`users/${like.userId}`);
        return afs.runTransaction((t) => __awaiter(this, void 0, void 0, function* () {
            const user = (yield t.get(userRef)).data();
            const userUpdate = Object.assign({}, user, { placesLiked: user.placesLiked + 1 });
            t.update(userRef, userUpdate);
            return t;
        }));
    });
}
exports.onLiked = onLiked;
function onUnLiked(data, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const like = data.data();
        const userRef = afs.doc(`users/${like.userId}`);
        return afs.runTransaction((t) => __awaiter(this, void 0, void 0, function* () {
            const user = (yield t.get(userRef)).data();
            const userUpdate = Object.assign({}, user, { placesLiked: user.placesLiked - 1 });
            t.update(userRef, userUpdate);
            return t;
        }));
    });
}
exports.onUnLiked = onUnLiked;
//# sourceMappingURL=likes.helpers.js.map
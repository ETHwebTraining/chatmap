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
admin.initializeApp();
const afs = admin.firestore();
function onDiscovered(data, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const discovery = data.data();
        const userRef = afs.doc(`users/${discovery.userId}`);
        return afs.runTransaction((t) => __awaiter(this, void 0, void 0, function* () {
            const user = (yield t.get(userRef)).data();
            const userUpdate = Object.assign({}, user, { placesDiscovered: user.placesDiscovered + 1 });
            t.update(userRef, userUpdate);
            return t;
        }));
    });
}
exports.onDiscovered = onDiscovered;
//# sourceMappingURL=discovered.helpers.js.map
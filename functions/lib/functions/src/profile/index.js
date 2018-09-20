"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const discovered_helpers_1 = require("./discovered.helpers");
const likes_helpers_1 = require("./likes.helpers");
exports.onDiscoveredPlace = functions.firestore.document('discoveries/{discoverId}')
    .onCreate(discovered_helpers_1.onDiscovered);
exports.manageLikes = functions.firestore.document('likes/{likeId}')
    .onWrite((data, context) => {
    if (data.after.exists && data.before.exists) {
        console.log(' this is an update operation');
        return null;
    }
    else if (!data.before.exists) {
        console.log('this is a create operation');
        return likes_helpers_1.onLiked(data.after, context);
    }
    else {
        console.log('this is a delete operation');
        return likes_helpers_1.onUnLiked(data.before, context);
    }
});
//# sourceMappingURL=index.js.map
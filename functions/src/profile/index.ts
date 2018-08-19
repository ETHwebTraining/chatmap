import * as functions from 'firebase-functions';
import { onDiscovered } from './discovered.helpers';
import { onLiked, onUnLiked } from './likes.helpers';



export const onDiscoveredPlace = functions.firestore.document('discoveries/{discoverId}')
.onCreate(onDiscovered);



export const manageLikes = functions.firestore.document('likes/{likeId}')
.onWrite((data, context) => {
    if (data.after.exists && data.before.exists) {
        console.log(' this is an update operation');
        return null;
    } else if (!data.before.exists) {
        console.log('this is a create operation');
        return onLiked(data.after, context);

    } else  {
        console.log('this is a delete operation');
        return onUnLiked(data.before, context);
    }
});

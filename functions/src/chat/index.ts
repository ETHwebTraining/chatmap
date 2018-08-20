import * as functions from 'firebase-functions';
import { onNewMessage } from './notification.helpers';


export const notifications = functions.firestore.document('places/{placeId}/messages/{messageId}')
.onCreate(async (data, context) => {
   return  await onNewMessage(data, context);
    // return onSanitize(data, context);
});

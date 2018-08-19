import * as functions from 'firebase-functions';
import { onNewMessage } from './notification.helpers';


export const notifications = functions.firestore.document('places/{placeId}/messages/{messageId}')
.onCreate(onNewMessage);

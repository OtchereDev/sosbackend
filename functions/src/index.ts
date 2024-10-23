import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';
// import * as functions from 'firebase-functions';
import axios from 'axios';
import { IResponder } from './types/IResponder';

admin.initializeApp();

const apiKey = 'aea3493c-8221-475d-bcec-01d32eabe2b2'; //functions.config().api.key;
const apiUrl = 'http://ec2-3-142-152-221.us-east-2.compute.amazonaws.com'; //functions.config().api.url;

export const onResponderDocumentChange = onDocumentWritten(
  'responders/{responderId}',
  async (event) => {
    const afterData = event.data?.after?.data() as IResponder;

    try {
      const response = await axios.post(
        `${apiUrl}/responders/set-current-location`,
        {
          userId: afterData.userId,
          location: `${afterData.latitude},${afterData.longitude}`,
          locationName: afterData!.locationName,
          apiId: apiKey,
        },
      );
      console.log('API request for users successful:', response.data);
    } catch (error: any) {
      console.error(
        'Error making API request for users:',
        error?.response?.data,
        error,
      );
    }
  },
);

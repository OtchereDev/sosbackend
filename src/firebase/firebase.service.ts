import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseApp: admin.app.App,
  ) {}

  async getDocument(collection: string, documentId: string): Promise<any> {
    const document = await this.firebaseApp
      .firestore()
      .collection(collection)
      .doc(documentId)
      .get();
    return document.exists ? document.data() : null;
  }

  async createResponder(data: {
    name: string;
    type: string;
    longitude: number;
    latitude: number;
    userId: string;
    email: string;
  }) {
    await this.firebaseApp
      .firestore()
      .collection('responders')
      .add({
        ...data,
      });
  }

  async createOrUpdateActiveEmergency(data: {
    emergency_id: string;
    user_id: string;
    type: string;
    severity: string;
    location: { name: string; longitude: number; latitude: number };
    responder_id: string;
  }) {
    const collection = this.firebaseApp
      .firestore()
      .collection('activeEmergency');

    // Query for an active emergency by emergency_id
    const querySnapshot = await collection
      .where('emergency_id', '==', data.emergency_id)
      .limit(1)
      .get();

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      await doc.ref.update({
        responder_id: data.responder_id,
      });
      return { message: 'Emergency updated successfully', id: doc.id };
    } else {
      const newDocRef = await collection.add({
        emergency_id: data.emergency_id,
        user_id: data.user_id,
        type: data.type,
        severity: data.severity,
        location: data.location,
        responder_id: data.responder_id,
        status: 'CONNECTING',
      });
      return { message: 'Emergency created successfully', id: newDocRef.id };
    }
  }

  async changeActiveEmergencyStatus(data: {
    emergency_id: string;
    status: string;
  }) {
    const collection = this.firebaseApp
      .firestore()
      .collection('activeEmergency');

    // Query for an active emergency by emergency_id
    const querySnapshot = await collection
      .where('emergency_id', '==', data.emergency_id)
      .limit(1)
      .get();

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      await doc.ref.update({
        status: data.status,
      });
      return { message: 'Emergency updated successfully', id: doc.id };
    }
  }

  async deleteActiveEmergency(emergency_id: string) {
    const collection = this.firebaseApp
      .firestore()
      .collection('activeEmergency');

    const querySnapshot = await collection
      .where('emergency_id', '==', emergency_id)
      .limit(1)
      .get();

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      await doc.ref.delete();
    }
  }
}

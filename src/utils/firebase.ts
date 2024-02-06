import {initializeApp} from 'firebase/app'
import {getFirestore} from 'firebase/firestore'
import {UploadResult, getStorage, ref, uploadBytes} from 'firebase/storage'

const config = {
  apiKey: 'AIzaSyBvCDrHE696IYBwKjoiVTqG3uuPYCk5808',
  authDomain: 'igs-rentals.firebaseapp.com',
  projectId: 'igs-rentals',
  storageBucket: 'igs-rentals.appspot.com',
  messagingSenderId: '40059688662',
  appId: '1:40059688662:web:b527f98e38be8e84c41b77',
}

const app = initializeApp(config)

const db = getFirestore(app)
const storage = getStorage(app)

export {db, storage}

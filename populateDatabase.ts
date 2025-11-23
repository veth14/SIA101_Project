
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from './src/components/maintenance/firebase';

async function populateDatabase() {
  try {
    // Add sample staff document
    const staffRef = await addDoc(collection(db, 'staff'), {
      adminId: 'admin123', // Placeholder
      fullName: 'John Emmanuel B. Mamaril',
      age: 25, // Placeholder
      gender: 'Male', // Placeholder
      classification: 'Maintenance', // Placeholder
      email: 'john.mamaril@example.com', // Placeholder
      phoneNumber: '+1234567890', // Placeholder
      rfid: '1226204341',
      createdAt: Timestamp.fromDate(new Date()),
    });
    console.log('Staff document added with ID:', staffRef.id);

    // Add sample attendance document for yesterday (to allow clock in today)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const attendanceRef = await addDoc(collection(db, 'attendance'), {
      staffId: staffRef.id,
      rfid: '1226204341',
      fullName: 'John Emmanuel B. Mamaril',
      timeIn: Timestamp.fromDate(yesterday),
      timeOut: Timestamp.fromDate(new Date(yesterday.getTime() + 8 * 60 * 60 * 1000)), // 8 hours later
      date: yesterday.toDateString(),
    });
    console.log('Attendance document added with ID:', attendanceRef.id);

    console.log('Database populated successfully!');
  } catch (error) {
    console.error('Error populating database:', error);
  }
}

populateDatabase();

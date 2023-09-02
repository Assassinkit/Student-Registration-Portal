const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());
// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/student_registration', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB successfully');
});


// Define the Student schema and model
const studentSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dob: { type: Date, required: true },
    email: { type: String, required: true },
    gender: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    password: { type: String, required: true },
    confirmPassword: { type: String, required: true },
    profileImage: { type: String, required: true },
});

const StudentModel = mongoose.model('student_details', studentSchema);



// API endpoint to handle form data
app.post('/api/register', async (req, res) => {
    const formData = req.body;

    try {

        // Check if the provided email or phone number already exists in the database
        const existingStudentByEmail = await StudentModel.findOne({ email: formData.email });
        const existingStudentByPhoneNumber = await StudentModel.findOne({ phoneNumber: formData.phoneNumber });

        if (existingStudentByEmail) {
            return res.status(400).json({ error: 'Email already exists. Please use a different email.' });
        }

        if (existingStudentByPhoneNumber) {
            return res.status(400).json({ error: 'Phone number already exists. Please use a different phone number.' });
        }

        // Save the form data to the database using async/await
        const student = new StudentModel(formData);
        const savedStudent = await student.save();
        console.log('Student saved:', savedStudent);
        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Error saving student:', err);
        res.status(500).send('Error saving student');
    }
});

// API endpoint to fetch student details
app.get('/api/students', async (req, res) => {
    try {
      // Fetch all student details from the MongoDB collection
      const students = await StudentModel.find();
  
      res.json(students);
    } catch (err) {
      console.error('Error fetching students:', err);
      res.status(500).send('Error fetching students');
    }
  });

// API end point to Delete the student data
app.delete('/api/students/:studentId', async (req, res) => {
    try {
      const { studentId } = req.params;
      await StudentModel.findByIdAndDelete(studentId);
      res.status(204).send(); 
    } catch (error) {
      console.error('Error deleting student from MongoDB:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });




// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

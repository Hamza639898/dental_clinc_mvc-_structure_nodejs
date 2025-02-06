require('dotenv').config();
const express = require('express');
const connectDB = require('./database/db');
const User = require('./models/User'); 
const app = express();


connectDB().then(() => {

  seedAdminUser();
}).catch((error) => {
  console.error('  falid connection to database :', error.message);
});


app.use(express.json());


async function seedAdminUser() {
  try {
   
    const adminData = {
      name: 'Admin',
      email: 'admin@example.com',
      password: 'password123', 
      role: 'admin'
    };

  
    let admin = await User.findOne({ email: adminData.email });
    if (!admin) {
      
      admin = await User.create(adminData);
      console.log('    create admin seccefuly :', admin);
    } else {
   
      admin.name = adminData.name;
      admin.password = adminData.password; 
      admin.role = adminData.role;
      await admin.save();
      console.log(' create admin    :', admin);
    }
  } catch (error) {
    console.error('err when create Admin:', error.message);
  }
}


app.use('/api/users', require('./routes/authRoutes'));      
app.use('/api/user', require('./routes/userRoutes'));         
app.use('/api/doctors', require('./routes/doctorRoutes'));    
app.use('/api/patients', require('./routes/patientRoutes'));  
app.use('/api/appointments', require('./routes/appointmentRoutes')); 


app.use(express.static('public'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` server work in ${PORT}`));

const express = require('express');
const cors = require('cors');
require('dotenv').config();


const userRoutes = require('./routes/userRoute'); 
const dishRoutes = require('./routes/dishRoute');

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use('/api', dishRoutes); 

app.listen(PORT, () => {
  // console.log(`✅ Server đang chạy tại: http://localhost:${PORT}`);
});
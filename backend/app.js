const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config({ path: path.join(__dirname, '.env') });
const port = process.env.PORT || 3000;
const dbConnection = require('./config/db.js');
const cors = require('cors');
const authRouter = require('./routes/authRoute.js');
const slotRouter = require('./routes/slotRoute.js');
const bookingRouter = require('./routes/bookingRoute.js');
const staffRouter = require('./routes/staffRoute.js');
const adminRouter = require('./routes/adminRoute.js');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler.js');

if (!process.env.TOKEN_KEY) {
  console.warn('TOKEN_KEY is not configured. Check backend/.env');
}

// middlewares

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


// routes
// app.use('/', homeRouter)
app.use('/auth', authRouter);
app.use('/slots', slotRouter);
app.use('/bookings', bookingRouter);
app.use('/staff', staffRouter);
app.use('/admin', adminRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Page not found'
  });
});

app.use(errorHandler);

async function startServer() {
  try {
    await dbConnection();
    app.listen(port, () => console.log(`server is running on port ${port}`));
  } catch (err) {
    console.log("❌ Database connection error:", err);
    process.exit(1);
  }
}

startServer();

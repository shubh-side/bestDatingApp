const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const profileRoutes = require('./routes/profiles');
const authRoutes = require('./routes/auth');
const matchesRouter = require('./routes/matches');
const messagesRouter = require('./routes/messages');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

app.use('/api/auth', require(authRoutes));
app.use('/api/profiles', require(profileRoutes));
app.use('/api/matches', require(matchesRouter));
app.use('/api/messages', require(messagesRouter));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
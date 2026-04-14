const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const shortid = require('shortid');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;
if (MONGODB_URI) {
    mongoose.connect(MONGODB_URI)
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.error('MongoDB connection error:', err));
}

// --- Schemas ---
const userSchema = new mongoose.Schema({
    clerkId: String,
    name: String,
    email: { type: String, unique: true },
    photoUrl: String,
    ecoPoints: { type: Number, default: 0 },
    donatedPoints: { type: Number, default: 0 },
});

const tripSchema = new mongoose.Schema({
    name: String,
    destination: String,
    creatorId: mongoose.Schema.Types.ObjectId,
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    shareCode: { type: String, default: () => shortid.generate() },
    date: { type: Date, default: Date.now },
});

const expenseSchema = new mongoose.Schema({
    tripId: mongoose.Schema.Types.ObjectId,
    description: String,
    amount: Number,
    payerId: mongoose.Schema.Types.ObjectId,
    splitWith: [mongoose.Schema.Types.ObjectId],
    isEcoFriendly: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Trip = mongoose.models.Trip || mongoose.model('Trip', tripSchema);
const Expense = mongoose.models.Expense || mongoose.model('Expense', expenseSchema);

// --- Routes ---

app.get('/api', (req, res) => {
    res.json({ message: 'Voyago API is running!' });
});

app.post('/api/auth/google', async (req, res) => {
    try {
        const { name, email, photoUrl } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ name, email, photoUrl });
            await user.save();
        } else {
            user.name = name;
            user.photoUrl = photoUrl;
            await user.save();
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find().sort({ ecoPoints: -1 }).limit(20);
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/trips', async (req, res) => {
    try {
        const { userId } = req.query;
        const trips = await Trip.find({ members: userId }).sort({ date: -1 });
        res.json(trips);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/trips', async (req, res) => {
    try {
        const { name, destination, creatorId } = req.body;
        const trip = new Trip({
            name,
            destination,
            creatorId,
            members: [creatorId]
        });
        await trip.save();
        res.json(trip);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/trips/join', async (req, res) => {
    try {
        const { shareCode, userId } = req.body;
        const trip = await Trip.findOne({ shareCode });
        if (!trip) return res.status(404).json({ error: 'Trip not found' });
        
        if (!trip.members.includes(userId)) {
            trip.members.push(userId);
            await trip.save();
        }
        res.json(trip);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/trips/:id', async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        res.json(trip);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/expenses', async (req, res) => {
    try {
        const { tripId, payerId } = req.query;
        let filter = {};
        if (tripId) filter.tripId = tripId;
        if (payerId) filter.payerId = payerId;
        
        const expenses = await Expense.find(filter).sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/expenses', async (req, res) => {
    try {
        const expense = new Expense(req.body);
        await expense.save();
        
        if (expense.isEcoFriendly) {
            await User.findByIdAndUpdate(expense.payerId, {
                $inc: { ecoPoints: 10 }
            });
        }
        res.json(expense);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = app;

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB bağlantısı
mongoose.connect('YOUR_MONGODB_URI', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Email şeması
const subscriberSchema = new mongoose.Schema({
    email: String,
    timestamp: { type: Date, default: Date.now }
});

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

// Email kaydetme endpoint'i
app.post('/api/subscribe', async (req, res) => {
    try {
        const { email } = req.body;
        
        // Email'i veritabanına kaydet
        const subscriber = new Subscriber({ email });
        await subscriber.save();
        
        res.status(200).json({ message: 'Email başarıyla kaydedildi' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Bir hata oluştu' });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
}); 
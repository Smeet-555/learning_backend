import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

function otpKey(phone) {
    return `otp:${phone}`;
}

app.post('/send-otp', async (req, res) => {
    const { phone } = req.body;
    if (!phone) {
        return res.status(400).json({ error: 'Phone number is required' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redis.set(otpKey(phone), otp, 'EX', 60); // OTP expires in 5 minutes

    console.log(`OTP for ${phone}: ${otp}`);
    res.json({ message: 'OTP sent successfully' });
});

app.post('/verify-otp', async (req, res) => {
    const { phone, otp } = req.body;
    const savedOtp = await redis.get(otpKey(phone));

    if(!savedOtp) {
        return res.status(400).json({ error: 'OTP expired or not found' });
    } 

    if (savedOtp !== otp) {
        return res.status(400).json({ error: 'Invalid OTP' });
    }

    await redis.del(otpKey(phone)); // OTP is used, delete it
    res.json({ message: 'OTP verified successfully' }); 
});

app.get('/otp/:phone/ttl', async (req, res) => {
    const ttl = await redis.ttl(otpKey(req.params.phone));
    res.json({ ttl });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
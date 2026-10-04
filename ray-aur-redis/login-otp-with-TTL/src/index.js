import express from 'express'
import Redis from 'ioredis'

const app = express()
app.use(express.json())
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')


function otpKey(phoneNumber){
    return `otp:${phoneNumber}`
}

app.post('/otp', async (req, res) => {
    const { phoneNumber} = req.body
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
    const ttl = 60; // OTP validity in seconds

    await redis.set(otpKey(phoneNumber), otp, 'EX', ttl); // Store OTP with TTL
    res.json({ message: 'OTP generated and stored', otp, ttl })
})

app.post('/otp/verify', async (req, res) => {
    const { phoneNumber, otp } = req.body
    const savedOtp = await redis.get(otpKey(phoneNumber))
    const submittedOtp = typeof otp === 'number' ? String(otp) : otp
    if (savedOtp !== null && savedOtp === submittedOtp) {
        await redis.del(otpKey(phoneNumber)) // Remove the OTP after successful verification
        res.json({ message: 'OTP verified successfully' })
    } else {
        res.status(400).json({ message: 'Invalid OTP' })
    }
})


app.get('/otp/:phoneNumber/ttl', async (req, res) => {
    const ttl=await redis.ttl(otpKey(req.params.phoneNumber))
    res.json({  ttl })
})



app.listen(3000,()=>{
    console.log('Server is running on port 3000')
})  

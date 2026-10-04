import express from 'express'
import Redis from 'ioredis'
import mongoose from 'mongoose'


const app = express()
app.use(express.json())
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')


const BANNER_KEY="app:banner"

app.post('/banner', async (req, res) => {
  await redis.set(BANNER_KEY, req.body.message ||"welcomm to ray aur redis")
  res.json({ message: 'Banner message set successfully' })
})

app.get('/banner', async (req, res) => {
  const message = await redis.get(BANNER_KEY)
  res.json({ message: message || 'No banner message set' })
})

app.delete('/banner', async (req, res) => {
  await redis.del(BANNER_KEY)
  res.json({ message: 'Banner message deleted successfully' })
})

app.get('/banner/exists', async (req, res) => {
    const exists = await redis.exists(BANNER_KEY)
    res.json({ exists: Boolean(exists) })
})

app.get('/redis', async (req, res) => {
  try {
    const reply = await redis.ping()
    res.json({ message: reply })
  } catch (error) {
    res.status(503).json({ error: 'Redis is unavailable' })
  }
})

app.get('/mongo', async (req, res) => {
  try {
    const url = process.env.MONGO_URL || 'mongodb://localhost:27017/ray-aur-mongo'
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(url)
    }
    res.json({ message: 'Connected to MongoDB', database: mongoose.connection.name })
  } catch (error) {
    res.status(503).json({ error: 'MongoDB is unavailable' })
  }
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
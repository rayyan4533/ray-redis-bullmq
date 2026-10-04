import express from 'express'
import Redis from 'ioredis'

const app = express()
app.use(express.json())
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')


const QUEUE_KEY = "queue:emails";

//here email is a job that we want to send to the user, so we will push it to the queue
app.post('/email', async (req, res) => {
    const job={
        to: req.body.to,
        subject: req.body.subject ||"no subject",
        body: req.body.body || "no content",
        createdAt: new Date().toISOString()
    }
    await redis.lpush(QUEUE_KEY, JSON.stringify(job))
    res.json({job,queued: true})
})

app.get('/email/process-one', async (req, res) => {
    const rawJob = await redis.rpop(QUEUE_KEY)
    if (!rawJob) {
        return res.json({ message: 'No jobs in the queue' })
    }
    const job = JSON.parse(rawJob)
    // Here you would normally process the job, e.g., send an email
    res.json({ message: 'Job processed', job })
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})

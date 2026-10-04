import express from 'express';




const app = express();

app.use(express.json());

app.post('/welcome-email', (req, res) => {
    emailQueue.add(
      "send-welcome-email",
      {
        userId: req.body.to,
        email: req.body.email
      },
      {
        attempts:3,
        backoff: {
          type: 'exponential',
          delay: 5000
        }
      }
    )
    res.status(200).json({ message: 'Welcome email job added to the queue' });
})


app.listen(3000, () => {
  console.log('API server is running on http://localhost:3000');
})
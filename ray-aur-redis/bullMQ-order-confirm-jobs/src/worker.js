import {Worker} from 'bullmq';
import {connection} from './queue.js';



// 1) queuename,2) business logic 3) connection do



const worker = new Worker(
    'email', // 1) queuename
    async (job )=> {
    console.log('Processing job:', job.id, job.name, job.data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Job completed:', job.id,job.name);
    },
    {connection}
)

worker.on('completed', (job) => {
    console.log(`Job ${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
    console.log(`Job ${job.id} has failed with error: ${err.message}`);
});
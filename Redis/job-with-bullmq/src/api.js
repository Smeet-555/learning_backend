import {express} from 'express';
import { emailQueue } from './queue.js';

const app = express();
app.use(express.json());

app.post('/send-email', (req, res) => {
    const { to, subject, body } = req.body;
    // Here you would normally add the email sending logic, but for this example, we'll just simulate it.
    console.log(`Received request to send email to ${to} with subject "${subject}" and body "${body}"`);
    
    // Simulate adding a job to the queue
    // In a real application, you would add the job to the BullMQ queue here.
    
    res.status(200).json({ message: 'Email job has been queued successfully!' });

    emailQueue.add('SendEmail', { to, subject, body }, {
        attempts: 3, 
        backoff: {
            type: 'exponential', 
            delay: 5000     
        }
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

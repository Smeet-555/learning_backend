import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const QUEUE_KEY = "queue:emails";

app.post("/email", async (req, res) => {
    const job = {
        to: req.body.to,
        subject: req.body.subject,
        body: req.body.body,
        createdAt: new Date().toISOString(),
    }
    await redis.lpush(QUEUE_KEY, JSON.stringify(job));
    res.json({ message: "Email job added to queue", job });
});

app.get("/email/process-one", async (req, res) => {
    const rawJob = await redis.rpop(QUEUE_KEY);
    if (!rawJob) {
        return res.json({ message: "No email jobs in queue" });
    }
    const job = JSON.parse(rawJob);
    // Simulate email sending
    res.json({ message: "Email job processed", job });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");


app.post("/user/:id/json" , async (req, res) => {
    await redis.set(`user:${req.params.id}:json`, JSON.stringify(req.body));
    res.json({savedAs : "json"});
});

app.get("/user/:id/json" , async (req, res) => {
    const raw = await redis.get(`user:${req.params.id}:json`); // the data here is stored in db in string format, so we need to parse it back to json before sending it to client , and also we cannot make any manipulations on the string data
    res.json({data : raw ? JSON.parse(raw) : null});
});

app.post("/user/:id/hash" , async (req, res) => {
    await redis.hset(`user:${req.params.id}:hash`, req.body);
    res.json({savedAs : "hash"});
});

app.get("/user/:id/hash" , async (req, res) => {
    const data = await redis.hgetall(`user:${req.params.id}:hash`);
    res.json({data : Object.keys(data).length > 0 ? data : null});
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
}); 
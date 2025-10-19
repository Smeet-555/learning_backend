import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.send('the server is up and running')
});

const PORT = process.env.PORT || 3000;

app.get('/api/jokes' , (req, res) => {
    const jokes = [
        {
            id: 1,
            title:'a joke',
            joke: "Why don't scientists trust atoms? Because they make up everything!"
        },
        {
            id: 2,
            title:'another joke',
            joke: "Why did the scarecrow win an award? Because he was outstanding in his field!"
        },
        {
            id: 3,
            title:'one more joke',
            joke: "Why don't skeletons fight each other? They don't have the guts."
        }
    ];
    res.json(jokes);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// import 'dotenv/config';
// import dotenv from "dotenv";
// import express from "express";
// import connectDB from "./db/index.js";

// dotenv.config({path: './env'}) 

// const app = express();
// const PORT = process.env.PORT || 8000;

// // Connect to database and start server
// const startServer = async () => {
//     try {
//         await connectDB()
//         .then(() => {app.listen( PORT),() =>{
//             console.log(`Server is running on port ${PORT}`); 
//         } })
//         .catch((error) => {
//             console.error("Database connection failed:", error);
//         })
        
//         app.on("error", (error) => {
//             console.error("Express app error:", error);
//             throw error;
//         });

//         app.listen(PORT, () => {
//             console.log(`Server is running on port ${PORT}`);
//         });
//     } catch (error) {
//         console.error("Failed to start the server:", error);
//         process.exit(1);
//     }
// };

// startServer();

// export default app; 

import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/index.js";
import userRouter from './routes/user.routes.js'; // Adjust the path

dotenv.config({ path: './env' });

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/v1/users', userRouter); // Mount the user routes

// Connect to database and start server
const startServer = async () => {
    try {
        await connectDB();
        console.log("Connected to the database successfully");
        
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Error starting the server:", error);
        process.exit(1);
    }
};

startServer();
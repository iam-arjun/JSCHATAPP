// app.js
import express from 'express'
import connectToMongoDB from './DB/dbconnect.js';
import path from 'path'
import cookieParser from "cookie-parser";
import cors from 'cors'


import authRoute from './ROUTES/auth.routes.js'
import msgRoute from './ROUTES/msg.routes.js'
import bodyParser from 'body-parser';
// import { verifyUser } from './MIDDLEWARE/verifyUser.js'
import session from 'express-session'
import http from 'http'
import { Server as SocketIOServer } from 'socket.io';

const app = express()
const server = http.createServer(app);
const io = new SocketIOServer(server);
// Middleware for session management
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));
app.use(express.json()); // to parse the incoming requests with JSON payloads (from req.body)
app.use(bodyParser.urlencoded({ extended: true }));



const __dirname = path.resolve();


app.use(cookieParser());
app.use(cors({ origin: "https://resonant-cheesecake-91ad4c.netlify.app" }))

app.use(express.static(path.join(__dirname, "/public")));





// Middleware to parse form data
// Middleware to parse cookies
app.use(cookieParser());


app.use('/auth', authRoute)
app.use('/msg', msgRoute)
// app.use(verifyUser)
let socketIds = {}
// Define Socket.IO events
export const getSocketIds = (receiverid) => {
    console.log(socketIds)
    return socketIds[receiverid];

}
io.on('connection', (socket) => {
    console.log('user conn')

    const userId = socket.handshake.query.userId;


    if (userId !== "undefined") socketIds[userId] = socket.id;

    // Handle chat message event
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg); // Broadcast the message to all connected clients
    });

    // // Handle disconnection
    // socket.on('disconnect', () => {
    //     console.log('User disconnected');
    // });
});
// Define a route to render index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
    connectToMongoDB()

}

);
export { app, io, server }
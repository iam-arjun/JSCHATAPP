// app.js
import express from 'express'
import connectToMongoDB from './DB/dbconnect.js';
import path from 'path'
import cookieParser from "cookie-parser";


import authRoute from './ROUTES/auth.routes.js'
import msgRoute from './ROUTES/msg.routes.js'
import bodyParser from 'body-parser';

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
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));



const __dirname = path.resolve();


app.use(cookieParser());


app.use(express.static(path.join(__dirname, "/public")));






app.use('/auth', authRoute)
app.use('/msg', msgRoute)

// Serve static files from the "uploads" directory
app.use('/UPLOADS', express.static(path.join(__dirname, 'UPLOADS')));
// app.use(verifyUser)
let socketIds = {}
// Define Socket.IO events
export const getSocketIds = (receiverid) => {

    return socketIds[receiverid];

}
io.on('connection', (socket) => {
    console.log('user conn')

    const userId = socket.handshake.query.userId;

    if (userId !== 'undefined') socketIds[userId] = socket.id;



    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
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
export { app, io, server, socketIds }
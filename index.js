const express = require("express");
const cors = require("cors");
const http = require('http');
const dbConnection = require("./db");
const userRoute=require("./Routes/Route")
const { Server } = require('socket.io');
const port = process.env.PORT || 2000;
const app = express();
const bodyParser = require("body-parser");
const fileUpload=require("express-fileupload");
const noteModel = require("./Model/notesSchema");
require('dotenv').config();

app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
}));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload({useTempFiles : true,}))
app.get("/",async (req,res)=>{
  res.json({
    message:"server start"
  })
})

app.use("/api", userRoute);
app.use((req, res, next) => {
  res.status(404).send('404 Not Found');
});


const activeUsers = {};
io.on("connection", (socket) => {
  console.log("✅ New socket connected:", socket.id);
});

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('join-note', ({ noteId }) => {

    console.log(`User joined note: ${noteId}`);
    
    socket.join(noteId);
    if (!activeUsers[noteId]) activeUsers[noteId] = [];
    activeUsers[noteId].push(socket.id);
    io.to(noteId).emit('active-users', activeUsers[noteId]);

    socket.on('send-changes', ({ noteId, content }) => {
      socket.to(noteId).emit('receive-changes', content);
    });

    socket.on('save-note', async ({ noteId, content }) => {
      await noteModel.findByIdAndUpdate(noteId, {
        content,
        updatedAt: new Date(),
      });
    });

    socket.on('disconnect', () => {
      if (activeUsers[noteId]) {
        activeUsers[noteId] = activeUsers[noteId].filter(id => id !== socket.id);
        io.to(noteId).emit('active-users', activeUsers[noteId]);
      }
      console.log('Client disconnected');
    });
  });
});






server.listen(port, () => {
  console.log("localhost://2000 start ...");
  dbConnection();
});

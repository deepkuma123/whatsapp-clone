import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import AuthRoute from "./routes/AuthRoutes.js";
import MessageRoute from "./routes/MessageRoutes.js";
import { Server, Socket } from "socket.io";
import { getInitialContactsWithMessages } from "./controllers/MessageController.js";
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads/recordings", express.static("uploads/recordings"));
app.use("/uploads/images", express.static("uploads/images"));

app.use("/api/auth", AuthRoute);
app.use("/api/message", MessageRoute);

const server = app.listen(process.env.PORT, () => {
  console.log(`server started at port ${process.env.PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

global.OnlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    OnlineUsers.set(userId, socket.id);
    socket.broadcast.emit("online-users", {
      OnlineUsers: Array.from(OnlineUsers.keys()),
    });
  });

  socket.on("signout", (id) => {
    OnlineUsers.delete(id);
    socket.broadcast.emit("online-users", {
      OnlineUsers: Array.from(OnlineUsers.keys()),
    });
  });

socket.on("send-msg", (data) => {
  const sendUserSocket = OnlineUsers.get(data.to);

  if (sendUserSocket) {
    socket.to(sendUserSocket).emit("msg-recieve", {
      from: data.from,
      message: data.message,
    });
    
  }
});
    
    socket.on("contact-msg", (data) => {
        const sendUserSocket = OnlineUsers.get(data.to);
        console.log(sendUserSocket);
        if (sendUserSocket) {
            // Emit the "new-message" event with the received users data
            socket
            .to(sendUserSocket)
            .emit("new-message", {
                users: data.users,
                OnlineUsers: data.OnlineUsers,
            });
            console.log(data.users);
        }
    });

    // socket.on("new-message", (data) => {
    //   // Handle the new message event
    //   // Assuming OnlineUsers is a Map, you need to use get() to retrieve the socket ID
    //   const sendUserSocket = OnlineUsers.get(data.users);

    //   if (sendUserSocket) {
    //     console.log("New message received:", data.users);

    //     // Emit an event to the client to inform about the new message
    //   }
    // });

  socket.on("outgoing-voice-call", (data) => {
    const sendUserSocket = OnlineUsers.get(data.to);

    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("incoming-voice-call", {
        from: data.from,
        roomId: data.roomId,
        callType: data.callType,
      });
    }
  });

  socket.on("outgoing-video-call", (data) => {
    const sendUserSocket = OnlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("incoming-video-call", {
        from: data.from,
        roomId: data.roomId,
        callType: data.callType,
      });
    }
  });

  socket.on("reject-voice-call", (data) => {
    const sendUserSocket = OnlineUsers.get(data.from);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("voice-call-rejected");
    }
  });

  socket.on("reject-video-call", (data) => {
    const sendUserSocket = OnlineUsers.get(data.from);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("video-call-rejected");
    }
  });

  socket.on("accept-incoming-call", ({ id }) => {
    const sendUserSocket = OnlineUsers.get(id);
    socket.to(sendUserSocket).emit("accept-call");
  });
});

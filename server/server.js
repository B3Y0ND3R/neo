const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const authRouter = require("./routes/auth/auth-routes");
require('./config/passport');
const shopProductsRouter = require("./routes/shop/products-routes")
const adminProductsRouter = require("./routes/admin/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const adminOrderRouter = require("./routes/admin/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");
const commonFeatureRouter = require("./routes/common/feature-routes");
const chatRouter = require("./routes/chat/chat-routes");
const http = require('http');
const { Server } = require('socket.io');
const adminBrandsRouter = require("./routes/admin/brands-routes");
const aboutUsRouter = require("./routes/aboutUs");
const faqRouter = require("./routes/faq");
const contactRouter = require("./routes/contact");

mongoose.connect('mongodb+srv://ahsanulhasib2:hasib&abid@cluster0.gdn8u.mongodb.net/')
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.log(error));

const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma"
    ],
    credentials: true
  })
);

app.use(cookieParser());

app.use(
  session({
    secret: '6f0d7270c876b0d5aa61e31acdcc6baf8fb1172001cb016256b513fc915b9966ae2f8d6494f8564ae0220b3bdf72ac6359047947ddac71f88b9185f946562690', 
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, 
        maxAge: 60 * 60 * 1000, 
      },
  })
);

app.use(passport.initialize());
app.use(passport.session());

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_chat', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on('leave_chat', (room) => {
    socket.leave(room);
    console.log(`User left room: ${room}`);
  });

  socket.on('send_message', async (data) => {
    try {
      console.log('Received message data:', data);
      // Emit the message to the specific room
      io.to(data.room).emit('receive_message', {
        sender: data.sender,
        senderRole: data.senderRole,
        content: data.content,
        timestamp: data.timestamp
      });
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Add chat routes
app.use("/api/chat", chatRouter);

app.use("/api/admin/orders", adminOrderRouter);

app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/shop/products",shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);
app.use("/api/common/feature", commonFeatureRouter);
app.use("/api/admin/brands", adminBrandsRouter);
app.use("/api/about-us", aboutUsRouter);
app.use("/api/faq", faqRouter);
app.use("/api/contact", contactRouter);
server.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));

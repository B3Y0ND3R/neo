const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const authRouter = require("./routes/auth/auth-routes");
require('./config/passport');

const adminProductsRouter = require("./routes/admin/products-routes");

mongoose.connect('mongodb+srv://ahsanulhasib2:hasib&abid@cluster0.gdn8u.mongodb.net/')
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.log(error));

const app = express();
const PORT = process.env.PORT || 5000;

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
app.use(express.json());

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


app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);


app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));

require("dotenv").config();
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const cors = require("cors");
const app = express();

app.use(express.static("public"));

//Request body parsing
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//CORS
// app.use(cors({origin: 'http://bellgomla.com'}));
app.use(cors());

//Mongoose && session store
//TODO: handle duplicate key error with mongoose
var sessionStore;
try {
  mongoose.connect(
    process.env.MONGODB_USER_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    () => {
      console.log("Database connected");
      //initialize session store
      sessionStore = new MongoStore({
        mongoose_connection: mongoose.connection,
        collection: "sessions",
        mongoUrl: process.env.MONGODB_USER_URL,
      });
    }
  );
} catch {
  console.log("ERROR: CAN'T CONNECT TO DATABASE");
}


//Express-session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: sessionStore,
  })
);

//Passport
require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());

//Routes
const apiRouter = require("./routes/api");
app.use("/api", apiRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}...`));

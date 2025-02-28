const express = require('express');
const dotenv = require("dotenv").config();
const cors = require('cors');
const connectDb = require('./config/dbConnect');
const cookieParser = require('cookie-parser');


connectDb();

const app = express();

app.use(express.json());
const allowedOrigins = [
    "http://localhost:3000",
    "https://homepagejwlnew.netlify.app"
]
app.use(cors({
    origin: function (origin,callback){
        if(!origin || allowedOrigins.includes(origin)){
            callback(null,true);
        }else{
            callback(new Error("Not allowed by CORS"));
        }
    } ,
    credentials: true,               // Allow cookies to be sent across domains
}));
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));


app.use("/users", require('./routes/userRoutes'));
app.use("/records", require('./routes/patientRoutes'));
app.use("/token", require('./routes/tokenRoutes'));
app.use("/client", require('./routes/clientRoutes'));
app.use("/admin", require('./routes/adminRoutes'));
app.use("/payment", require('./routes/paymentRoutes'));
app.use("/prices", require('./routes/pricesRoutes'));

const port = process.env.PORT || 5000;
app.listen(port, ()=>{
    console.log(`server is running on ${port}`);
})

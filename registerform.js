const express = require('express');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const app = express();
const bcrypt = require('bcrypt')
const port = 3013;
const path = require('path')

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/userAccounts');
mongoose.connection.on('connected', () => {
    console.log('mongoDB connection successful');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

// Mongoose model for the users collection
const OtpModel = mongoose.model('Users', {
    email: String,
    password:String,
    otp: Number,
});

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'hemanthenquiries@gmail.com',
        pass: 'ihurasiqdlazaohz',
    },
});

transporter.verify(function (error, success) {
    if (error) {
        console.error('Nodemailer verification failed:', error);
    } else {
        console.log('Nodemailer connection successful');
    }
});

// Middleware to parse JSON and handle form submissions
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// for serving static files (e.g., HTML, CSS)
// app.use(express.static(__dirname));

// Set the view engine to EJS because we need to render dynamic content
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'index.html'))
 });
 app.get('/signup',(req,res)=>{
    // res.render('register',{error:null});
    res.send('<h1>signup page</h1>')
 })

 app.post('/submit', async (req, res) => {
    const {email,password,confirmpassword} = req.body;
    try {
        await transporter.verify()
         // this existingUser variable checks whether the entered mail is already registered in database or not
        //if exists => it returns a bad request with "user already exists" message
        // if not => it creates a new user 
        const existingUser = await OtpModel.findOne({ email })
        if (existingUser) {
            console.log('User already exists:', email);
            const errorMessage = 'User Already Exists';
            // Redirect with UserAlreadyExists error
            return res.render('register', { error: errorMessage });

        }
        //if password and confirm password mismatches it throw an error message
        if(password != confirmpassword){
            const errorMessage = "Password not matched"
            return res.render('register',{error:errorMessage})
        }
        // this otp variable generates a random 4 digit number
        const otp = Math.floor(1000 + Math.random() * 9000);
        // Send OTP via email
        const mailOptions = {
            from: 'hemanthenquiries@gmail.com',
            to: email,
            subject: 'OTP for Registration',
            text: `Your OTP for creating a blog account is: ${otp}`,
        };
        await OtpModel.findOneAndUpdate({ email }, { email, password,otp }, { upsert: true });
        console.log('OTP stored successfully:', otp);
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).send('Internal Server Error');
            }

            console.log('Email sent:', info.response);
            console.log(email)
            // Render verify.ejs file  with email value
            res.render('verify', { email: email });
        });
    } catch (error) {
        console.error('Error handling submission:', error);
        const errorMessage = 'InternalServerError';
        return res.render('register', { error: errorMessage });
    }
});

// Express route to handle OTP verification
app.post('/verify', async (req, res) => {
    const email = req.body.email;
    const userOTP = parseInt(req.body.otp, 10);
    // get the stored OTP from the database using Mongoose
    try {
        const user = await OtpModel.findOne({ email });
        console.log('Verification Start - Email:', email, 'OTP:', userOTP);
        if (user && user.otp !== undefined && user.otp === userOTP) {
            console.log('Verification Success');
            const message = "Registration Successful";
            return res.render('verify', { message: message, error: null, email: email });
        } else {
            console.log('Verification Failed');
            const errorMessage = "Incorrect OTP"
            return res.render('verify',{error:errorMessage,email:email})
        }
    } catch (error) {
        console.error('Error retrieving OTP:', error);
        res.status(500).send('Internal Server Error');
    }
});
//express route after user clicked on login here
app.get('/login1', (req, res) => {
    res.render('login');
  });

// express route after user clicks on login button from login form
app.post('/login', async (req, res) => {
    const { email,password } = req.body;
    try {
        // Check if the user with the provided email exists in the database
        const user = await OtpModel.findOne({ email });

        if (!user) {
            // User not found or incorrect password
            const error = 'Invalid email or password. Please try again.';
            return res.render('login', { error, message: null });
        }
        if(user.password != password){
            const error = 'Invalid email or password. Please try again.';
            return res.render('login', { error, message: null });
        }
        // User found and password matches then it will be redirected to the homepage.html file
        res.sendFile(path.join(__dirname,'homepage.html'))
    } catch (error) {
        console.error('Error during login:', error);
        // Handle other errors, e.g., database connection issues
        return res.render('login', { error: 'An error occurred during login.', message: null });
    }
});

// Start the server at port 3013 
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

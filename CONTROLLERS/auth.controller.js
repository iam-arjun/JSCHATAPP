import Signupmodel from '../Models/Users.js'

import bcrypt from 'bcrypt'
import { socketIds } from '../index.js';
import multer from 'multer'
import path from 'path'


import jwt from 'jsonwebtoken'
import { Error } from 'mongoose';
const secretKey = 'your_secret_key'; // Replace this with your own secret key
export const signup = async (req, res) => {

    try {
        const { fullname, email, password, cpassword } = req.body

        if (password !== cpassword) {

            return res.status(401).json('Password doesnot match!!!!')
        }
        const existedUser = await Signupmodel.findOne({ email })

        if (existedUser) {

            return res.status(401).json('User already exists!!!')
        }
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with a salt round of 10

        const newUser = new Signupmodel({
            fullname, email, password: hashedPassword

        })
        await newUser.save()
        res.json({ message: 'Signup successful', data: newUser });



    } catch (error) {
        throw new Error(error)

    }

}

export const login = async (req, res) => {

    try {

        const { email, password } = req.body
        const user = await Signupmodel.findOne({ email })

        // If user not found or password incorrect, send unauthorized response
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send('Invalid username or password');
        }
        // Generate a token
        const token = jwt.sign({ userId: user._id, userEmail: user.email, userName: user.fullname }, secretKey, { expiresIn: '1h' }); // Token expires in 1 hour
        // Store the token in a cookie
        res.cookie('token', token, { httpOnly: true }); // httpOnly ensures the cookie is not accessible via client-side JavaScript
        res.json({ message: 'Login successful', data: user });




    } catch (error) {
        throw new Error(error)
    }



}

export const getAllUsers = async (req, res) => {
    try {


        const dataFromDB = await Signupmodel.find()


        const filteredUser = dataFromDB.filter((e) => { return e.fullname !== req.session.user.userName });


        // Convert data to an array
        const UsersFound = filteredUser.map(item => item.toObject());

        res.json({ data: UsersFound })



    } catch (error) {
        throw new Error(error)
    }



}

export const logout = async (req, res) => {

    try {


        res.clearCookie('token');
        delete socketIds[req.params.id]
        res.json({ message: 'Logout successful' });





    } catch (error) {
        throw new Error(error)
    }


}

export const getOnlineUsers = async (req, res) => {
    try {
        res.json({ data: socketIds })

    } catch (error) {
        throw new Error(error)
    }
}




// Image controller 
export const UploadImg = async (req, res) => {

    // Set up storage engine using multer
    const storage = multer.diskStorage({
        destination: 'UPLOADS/',
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    });




    // Initialize upload variable with multer configuration
    const upload = multer({
        storage: storage,
        limits: { fileSize: 1000000 }, // Limit file size to 1MB
        fileFilter: function (req, file, cb) {
            checkFileType(file, cb);
        }
    }).single('profile-pic');
    // Check file type
    function checkFileType(file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {


            return cb(null, true);


        } else {
            cb('Error: Images Only!');
        }
    }



    // Route to handle profile picture upload

    upload(req, res, async (err) => {


        if (err) {
            res.status(400).json({ success: false, message: err });
        } else {
            if (req.file == undefined) {
                res.status(400).json({ success: false, message: 'No file selected!' });
            } else {

                const existedImg = await Signupmodel.findOneAndUpdate(
                    { fullname: req.body.name },
                    { profilePic: req.file },
                    { new: true } // Return the updated document
                );
                if (existedImg) {
                    res.json({ success: true })
                }
                else {

                    res.json({ success: false })
                }


            }
        }
    });
}

export const getProfilePic = async (req, res) => {
    try {


        const UserPP = await Signupmodel.findOne({ fullname: req.session.user.userName })

        if (UserPP.profilePic) {

            res.json({ imgUrl: `UPLOADS/${UserPP.profilePic.filename}` })
        }
        else {
            return;
        }



    } catch (error) {
        throw new Error(error)
    }
}























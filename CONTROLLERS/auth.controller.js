import Signupmodel from '../Models/Users.js'
import bcrypt from 'bcrypt'

import jwt from 'jsonwebtoken'
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
        const { authid } = req.body

        const dataFromDB = await Signupmodel.find()


        const filteredUser = dataFromDB.filter((e) => { return e.fullname !== authid });


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
        res.json({ message: 'Logout successful' });


    } catch (error) {
        throw new Error(error)
    }




}


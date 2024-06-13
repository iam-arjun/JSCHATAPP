
import jwt from 'jsonwebtoken'
const secretKey = 'your_secret_key'; // Replace this with your own secret key
let userName;
export const verifyUser = (req, res, next) => {
    const token = req.cookies.token;


    if (!token) {
        return res.status(401).send('Please signin to move further !!!');
    }

    // Verify the token
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {

            res.clearCookie('token');
            return res.status(403).send('Please signin to move further !!!');

        }

        // Store user data in session
        req.session.user = decoded;





        next()
    });

}
export { userName }
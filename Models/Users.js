import mongoose from "mongoose"


const RegisterSchema = mongoose.Schema(
    {
        fullname: {
            type: String, required: true,
        },
        email: {
            type: String, required: true,
        },
        password: {
            type: String, required: true,
        },
        profilePic: {
            filename: String,
            path: String,
            contentType: String
        },

    },
    { timestamps: true }

)

const RegisterModel = mongoose.model('Signup', RegisterSchema)


export default RegisterModel
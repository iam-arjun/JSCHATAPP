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

    },
    { timestamps: true }

)

const RegisterModel = mongoose.model('Signup', RegisterSchema)


export default RegisterModel
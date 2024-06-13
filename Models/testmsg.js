import mongoose from "mongoose"


const TestMsgSchema = mongoose.Schema(
    {
        senderid: {
            type: String, required: true,
        },
        receiverid: {
            type: String, required: true,
        },
        msg: {
            type: String, required: true,
        },

    },
    { timestamps: true }

)

const TestMsgModel = mongoose.model('Testmsg', TestMsgSchema)


export default TestMsgModel
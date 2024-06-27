import TestMsgModel from "../Models/testmsg.js";
import { getSocketIds } from "../index.js";
import { io } from "../index.js";
export const sendmsg = async (req, res) => {

    const { senderid, receiverid, msg } = req.body


    try {

        const newmsg = new TestMsgModel({
            senderid: senderid,
            receiverid: receiverid,
            msg: msg
        })


        await newmsg.save()
        res.json({ data: newmsg })
        let receiver_socket_id = getSocketIds(receiverid)
     
        io.to(receiver_socket_id).emit("newMessage", newmsg);


    } catch (error) {
        throw new Error(error);



    }


}
export const getMsgs = async (req, res) => {
    try {

        // GETTING THE ALL MESAGES FROM THE DB

        const msgFromDB = await TestMsgModel.find()
        const msgsFound = msgFromDB.map(item => item.toObject());

        const filteredmsgs = msgsFound.filter((e) => { return e.senderid === req.session.user.userName || e.receiverid === req.session.user.userName })
        res.json({ data: filteredmsgs })
    } catch (error) {
        throw new Error(error)

    }

}

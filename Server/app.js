const express = require('express')
const mongoose = require('mongoose')
const User = require('./model/user')
const Conversation = require("./model/conversation")
const Message = require('./model/messages')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const user = require('./model/user')
require('dotenv').config()
const io = require('socket.io')(5000, {
    cors: {
        origin: 'http://localhost:5173'
    }
})



const app = express()
const port = 3000


mongoose.connect("mongodb://localhost:27017/chat-app").then(() => {
    console.log("Dtabase connected....")
}).catch((e) => {
    console.log(e)
})

// middleware
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
}));

//socket.io
let Users = []
io.on('connection', socket => {
    socket.on('addUser', userId => {
        const isUserExist = Users.find(user => user.userId === userId)
        if (!isUserExist) {
            const user = { userId, socketId: socket.id }
            Users.push(user)
            io.emit('getUsers', Users)
        }
    })

    socket?.on('sendMessage', async ({ conversationId, senderId, message, receiverId }) => {
        const receiver = Users.find(user => user.userId === receiverId)
        console.log("receiver:>", receiver)
        const sender = Users.find(user => user.userId === senderId)
        console.log("sender:>", sender)
        const user = await User.findById(senderId)
        if (receiver) {
            io.to(receiver.socketId).to(sender.socketId).emit('getMessage', { conversationId, senderId, message, receiverId, user: { id: user._id, name: user.name, email: user.email } })
        }
    })


    socket.on('disconnected', () => {
        Users = Users.filter(user => { user.socketId !== socket.id })
        io.emit('getUsers', Users)
    })
})


app.post('/register', async (req, res) => {

    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            res.status(400).send("All Fields are require")
        } else {

            const isexist = await User.findOne({ email })

            if (isexist) {
                res.status(400).send("User already Exist")
            }

            const hashpassword = await bcrypt.hash(password, 10)
            const user = new User({ name, email, password: hashpassword })
            await user.save()
            return res.status(200).send('User Register Successfully')

        }


    } catch (error) {
        console.log(error)

    }
});

app.post('/login', async (req, res) => {
    try {

        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).send("All Field are require")
        }
        const user = await User.findOne({ email })


        if (!user) {
            return res.status(400).send("User Not Found")
        }
        const verifypassword = await bcrypt.compare(password, user.password)

        if (!verifypassword) {
            return res.status(400).send("Password is Incorrect")
        }
        const token = jwt.sign({ userId: user._id }, process.env.SECRET);
        await User.findByIdAndUpdate(user._id, { token });
        return res.status(200).json({ message: "Login successful", token, user: { id: user._id, name: user.name, email: user.email } });



    } catch (error) {
        return res.status(400).json({ error: "error is:", error })

    }


});


app.post('/conversation', async (req, res) => {
    try {
        const { senderId, receiverId } = req.body
        const newconversation = new Conversation({ members: [senderId, receiverId] })
        await newconversation.save()
        res.status(200).send('Conversation created successfully')
    } catch (error) {
        console.log('Error', error)
    }
})


app.get('/conversation/:id', async (req, res) => {
    try {
        const userid = req.params.id
        const conversation = await Conversation.find({ members: { $in: [userid] } })
        const conversationUserData = Promise.all(conversation.map(async (conversation) => {
            const receiverid = await conversation.members.find((member) => member !== userid)
            const user = await User.findById(receiverid)
            return { user: { id: user.id, name: user.name, email: user.email }, conversationId: conversation._id }
        }))
        res.status(200).json(await conversationUserData)
    } catch (error) {
        console.log('Error', error)
    }

})

app.post('/messages', async (req, res) => {
    try {
        const { conversationId, senderId, message, receiverId = '' } = req.body
        if (!senderId || !message) res.status(400).send("enter message")
        if (conversationId === 'new' && receiverId) {
            const newconversation = new Conversation({ members: [senderId, receiverId] })
            await newconversation.save()
            const newmessage = new Message({ conversationId: newconversation._id, senderId, message })
            await newmessage.save()
            return res.status(200).send("message Sent Successfully")
        } else if (!conversationId && !receiverId) {
            res.status(400).send("Please fill all field")
        }
        const newmessage = new Message({ conversationId, senderId, message })
        await newmessage.save()
        res.status(200).send("message Sent Successfully")
    } catch (error) {
        console.log('Error:', error)
    }
})


app.get('/messages/:conversationId', async (req, res) => {
    try {
        const checkMessages = async (conversationId) => {
            const messages = await Message.find({ conversationId })
            const messageUserData = Promise.all(messages.map(async (message) => {
                const user = await User.findById(message.senderId)
                return { user: { id: user._id, name: user.name, email: user.email }, message: message.message }
            }))
            return res.status(200).json(await messageUserData)
        }
        const conversationId = req.params.conversationId
        if (conversationId === 'new') {
            const checkConversation = await Conversation.find({ members: { $all: [req.query.senderid, req.query.receiverid] } })
            if (checkConversation.length > 0) {
                checkMessages(checkConversation[0]._id)
            } else {
                return res.status(200).json([])
            }
        } else {
            checkMessages(conversationId)
        }

    } catch (error) {
        console.log("Error:", error)
    }
})








app.get('/user/:userid', async (req, res) => {
    try {
        const userid = req.params.userid
        const user = await User.find({ _id: { $ne: userid } })
        const UserData = Promise.all(user.map(async (user) => {
            return { user: { name: user.name, email: user.email, id: user._id } }
        }))
        return res.status(200).json(await UserData)
    } catch (error) {

    }
})




app.listen(port, () => {
    console.log(`Server is running on the port number ${port}`)
})
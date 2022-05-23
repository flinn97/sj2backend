const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
var cors = require('cors');
const app = express();
app.use('/public/', express.static(__dirname + '/public/'));
const dotenv = require('dotenv');
dotenv.config();
const Account = require("./AccountSchema");
const User = require("./users.js");
const argon2 = require("argon2");
const Student = require("./StudentSchema.js");
var jwt = require("jsonwebtoken");
const config = require("./auth.config");
var generator = require('generate-password');
var password = generator.generate({
    length: 10,
    numbers: true
});

//use cors, mongoose and connect to controller
var corsOptions = {
	origin: "*"
};
app.use(cors(corsOptions)); 

var helmet = require('helmet')
app.use(helmet())

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
	  extended: false
}));

mongoose.connect('mongodb://localhost:27017/music', {
	useUnifiedTopology: true,
	useNewUrlParser: true
})
	.then(() => {
		console.log("Successfully connect to MongoDB.");
	})
	.catch(err => {
		console.error("Connection error", err);
		process.exit();
	});

app.get("/", (req, res) => {
	res.json({ message: "Welcome to application." });
});

/**
 * signin
 */
app.post('/legato/signin', async function (req, res) {
    if(!req.body.email){return null}
    //get token
	var token = await jwt.sign({ id: "1167107"}, config.secret, {
		expiresIn: 86400 // 24 hours
	});
    //send back with admin account.
    if (req.body.email === "taylor@flinnapps.com") {
        if (req.body.password === "Samantha0320!") {
            return res.status(200).send([{
                email: req.body.email,
                role: "admin",
                firstName: "Taylor",
                lastName: "Davidson",
                accessToken: token,
            }]);
        }
    }
    //get user depending on email or username.
    let user= !req.body.email.includes("@")? await Student.find({_id: req.body.email}):await User.find({email: req.body.email});
    //return nothing if it doesn't exist
    if(!user){return}
    //send back the user info if they were already logged in.
    if (req.body.loggedin) {
		if (user){
            user[0].password=""
			return res.status(200).send([user[0]]);
		}
	}
    //If password was sent back verify it and send back the right info.
    if(req.body.password){
        let signin
        try{signin = await argon2.verify(user[0].password, req.body.password);}
        catch(e){signin=false}
    if (signin || user[0].password === req.body.password){
        return res.status(200).send([user[0], token]);
    }
}
})

/**
 * getAllusers
 */
app.get("/legato/getAllusers", async function (req, res)  {
    try {

            let user = await User.find();
			console.log(user)

            if (user) {
                return res.status(200).send(
                    user,
                );
            }
            else {
                return res.status(404).send({
                    message: "no Users exist not found",
                })
            }
       
    }
    catch {
        return res.status(404).send({
            message: "no Users exist not found",
        })
    }

})
/**
 * signup
 */
app.post('/legato/signup', async function (req, res) {
	console.log(req.body)
    if (!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.password)
        return res.status(400).send({
            message: "first name, last name, Email and password are required"
        });
    try {
         //  Check to see if Email already exists and if not send a 403 error. A 403
        // error means permission denied.
        const existingUser = await User.findOne({
            email: req.body.email
        });
        if (existingUser) {
          //console.log("u");
            return res.status(403).send({
                message: "email already exists"
            });
        }
        // create a new user and save it to the database
        var cryptpass = await argon2.hash(req.body.password);
        const user = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: cryptpass,
            role: "teacher",
            about: "",
            phone: ""
        });
        await user.save((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
        });
			return res.send({
            	user

            });
    }
        catch (error) {
        //console.log(error);
        return res.sendStatus(500);
    }
});
/**
 * addstudent
 */
app.post('/legato/addstudent', async function (req, res) {
    try {
        const pass = password;
            const student = new Student({
                firstName: req.body.first,
                email:"",
                username:pass,
        lastName: req.body.last,
        password: pass,
		userID: req.body.user.id,
        role: "student",
        pastFirstTime: false,
        scheduling: req.body.aschedule,
        day: req.body.day,
        newlyadded: false,
            homeworks: req.body.homeworks,
            mainGoal: {
                title: req.body.maingoal,
                description: req.body.maindescription,
                date: req.body.maindate,
                complete: false,
            },
            daysbool: req.body.daysbool,
            timebool: req.body.timebool,
            starPoints: req.body.starPoints,
            level: "0",
            starpoints: "0",
            starpointsGoal: "100",
            mstarpoints: req.body.manualsetup,
            goals: req.body.goals,
            mainGoals: [{mainGoal: {
                title: "Edit this goal to something you like.",
                description: "",
                date: "",
                complete: false,
                completed: "",
                goals: [
                ],
            }}],
            weekStreak: req.body.weekStreak,
            dayStreak: req.body.dayStreak,
            daystreak: "0",
            dayTotal: req.body.day1,
            totalDays: req.body.days,
            monthStart: req.body.smonths,
            monthEnd: req.body.emonths,
            timebiao: req.body.timeframePracticebiao,
            wmin: req.body.min,
            tsmonths: req.body.tsmonths,
            temonths: req.body.temonths,
            timeTotal: req.body.time1,
            finalTotalTime: "0",
            time: req.body.yesnoTime,
            totalDaysPracticed:"0",
            daysPracticed: "0",
            totalTime: "0",
            timeday: req.body.timeSync,
            hwtime: {
                mon: "0",
                tues: "0",
                wed: "0",
                thur: "0",
                fri: "0",
                sat: "0",
                sun: "0",
            },
            min: req.body.weeklytimebiao,
            daybiao: req.body.dailytimebiao,
            dmin: req.body.dmin,
            totalWeekTime: {
                total: "0",
            },
            checkboxes: req.body.checkbox,
            syncedCheckbox: req.body.syncCheckbox,
            syncedCheckboxes: {
                mon: false,
                tues: false,
                wed: false,
                thur: false,
                fri: false,
                sat: false,
                sun: false,
			}})
            await student.save();
            //update array within the teacher schema
            await User.updateOne({
                _id: req.body.user._id
            }, {
                $push: { students: student }
            }
            );
            return res.status(200).send({
				student
            });
        }
     catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});
app.post('/legato/changeData', async function (req, res) {
    if(req.body.role="teacher"){
        for(const key in req.body.changeData){
            await User.updateOne({
                _id: req.body.id
            }, {
                [key]: req.body.changeData[key]
            });
        }       
    }
    if(req.body.role="student"){
        for(const key in req.body.changeData){
            await Student.updateOne({ _id: req.body.id }, {
                [key]: req.body.changeData[key]
            });
        }
        let productToUpdate = await Student.findById(req.body.id);
        let user= await User.findById(req.body.userid);
        let studentlist= user.students
        for (let i=0; i<user.students.length; i++){
            if(user.students[i]._id.toString()===req.body.id.toString()){
                studentlist[i]=productToUpdate
                break;
            }
        }
        await User.updateOne({_id: req.body.userid},  {students: studentlist})
        
        
    }
})


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('Server listening on port 8080!'));

const config = require("./auth.config");
const User = require("./users");
const argon2 = require("argon2");
const Student = require("./StudentSchema.js");
var jwt = require("jsonwebtoken");
const Account = require("./AccountSchema");
exports.getAccount = async (req, res) => {
    const existingUser = await Account.findOne({
        _id: req.body.id
    });
    if (existingUser) {
        //console.log(existingUser);
        return res.status(200).send({
            account: existingUser,
        })
    }
}
exports.getAccounts = async (req, res) => {
    //allows the front end teacher to access all of their students.
    try {

        //console.log("lets try this", req.body);




        //console.log(req.body);


        let account = await Account.findOne({
            _id: req.body.id,
        });

        //console.log(student);
        let students = [];
        for (let i = 0; i < account.account.length; i++) {

            let student = await Student.findOne({ _id: account.account[i] });
            students.push(student);

        }
        return res.send(students);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

exports.changeuserinfo = async (req, res) => {
    
    if (!req.body) {
        return res.status(400).send({
            message: "No Data Changed"
        });
    }
   
    try {
        
        if (req.body.firstname) {
            await User.updateOne({ _id: req.body.id }, {
                firstname : req.body.firstname
            });
            
        };
        if (req.body.lastname) {
            await User.updateOne({ _id: req.body.id }, {
                lastname : req.body.lastname
            });
            
        };
        if (req.body.about) {
            await User.updateOne({ _id: req.body.id }, {
                about : req.body.about
            });
           
        };
        if (req.body.email) {
            await User.updateOne({ _id: req.body.id }, {
                email : req.body.email
            });
            await Account.updateOne({ _id: req.body.accountid }, {
                email: req.body.email
            });
            
        };
        if (req.body.phone) {
            await User.updateOne({ _id: req.body.id }, {
                phone : req.body.phone
            });

        };
        const changed = await User.findOne({
            _id: req.body.id
        });
        

        res.status(200).send({
            changed: changed,
            
        });

        
    }
    catch {
        console.log("I got here");
    }
};

//controller controls signup, signin, logout functionality
    //sign up user
exports.getUser = async (req, res) => {
    console.log("body", req.body);
    const usrAccount = await Account.findOne({
        _id: req.body.id
    })
    if (usrAccount) {
        let id = usrAccount.account[0];
        const existingUser = await User.findOne({
            _id: id
        });
        if (existingUser) {
            //console.log(existingUser);
            return res.status(200).send({
                user: existingUser,
            })
        }
    }
    else {
        const existingUser = await User.findOne({
            _id: req.body.id
        });
        if (existingUser) {
            //console.log(existingUser);
            return res.status(200).send({
                user: existingUser,
            })
    }
    
    
    }

};


exports.signup = async (req, res) => {

    console.log(req.body);

    //console.log(req.body.email);
    //console.log(req.body.password);
    //console.log(req.body);
    //make sure arguments got passed through.
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
        //create an account with the user as well. Yes it seems redundant but useful for what I'm doing.
        const account = new Account({
            email: req.body.email,
            teacherID: user._id,
            password: cryptpass,
            role: "teacher",
            DoubleAccount: false,

        });
        await account.save();
        const SaveUser = await User.findOne({
            email: req.body.email
        });
        await Account.updateOne({
            email: req.body.email
            }, {
                $push: { account: SaveUser  }
            }
            );
        const AccountSave = await Account.findOne({
            email: req.body.email
        });
        //console.log(AccountSave);


            // create token with jwt.sign and secret key.

        var token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400 // 24 hours
            });
        //console.log("acount", AccountSave);

            return res.send({
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                role: user.role,
                accessToken: token,
                account: AccountSave,
                about: user.about,
                phone: user.phone

            });
    }
        catch (error) {
        //console.log(error);
        return res.sendStatus(500);
    }
};

async function Match(account, password) { 
    console.log(account, password);
    const start = false;
    try {
        let matching = await argon2.verify(account.password, password);
        console.log(matching);
        return matching;
    }
    catch {
        console.log("nope!");
    }
    return start;
}

exports.deleteStudent = async (req, res) => {
    console.log( "delete section", req.body);
    const student = await Student.findOne({
        _id: req.body.student,
    });
    console.log(student);

    //console.log(student, studentAccount);
    if (student.sep) {
        Student.deleteOne({ _id: req.body.student, }, function (err) {
            if (err) console.log(err);
            console.log("Successful deletion");
        });
        Account.deleteOne({ email: req.body.email, sep: true }, function (err) {
            if (err) console.log(err);
            console.log("Successful deletion");
        });

    }
    else if (student.doubleAccount) {
        console.log(student.doubleAccount)
        Student.deleteOne({ _id: req.body.student, }, function (err) {
            if (err) console.log(err);
            console.log("Successful deletion");
        });
        const studentAccount = await Account.findOne({
            email: req.body.email, sep: false,
        })

        console.log(studentAccount);
        const arr = [];
        for (let i = 0; i < studentAccount.account.length; i++) {
            if (studentAccount.account[i].toString() !== req.body.student.toString()) {
                console.log(req.body.student);
                console.log(studentAccount.account[i]);
                arr.push(studentAccount.account[i]);
            }
        }
        if (arr.length > 0) {
            await Account.updateOne({ email: req.body.email, sep: false }, {
                account: arr
            });
        }
        else {
            Account.deleteOne({ email: req.body.email, sep: false }, function (err) {
                if (err) console.log(err);
                console.log("Successful deletion");
            });
        }


    }
    else {
        Student.deleteOne({ _id: req.body.student, }, function (err) {
            if (err) console.log(err);
            console.log("Successful deletion");
        });
        Account.deleteOne({ email: req.body.email, }, function (err) {
            if (err) console.log(err);
            console.log("Successful deletion");
        });
    }
}

//sign in the user.
exports.signin = async (req, res) => {
    
    console.log(req.body.email);
    //console.log(req.body.email);
    console.log(req.body.password);
    //make sure there are arguements
    if (!req.body.email || !req.body.password) {
        return res.sendStatus(400);

    }
    if (req.body.email === "taylor@flinnapps.com") {
        if (req.body.password === "Samantha0320!") {
            var token = jwt.sign({ id: "1167107"}, config.secret, {
                expiresIn: 86400 // 24 hours
            });
            return res.status(200).send({
                email: req.body.email,
                role: "admin",
                firstName: "Taylor",
                lastName: "Davidson",
                accessToken: token,
            });
        }
    }
    try {
        
        const accounts = await Account.find({
            email: req.body.email
        });

        
        //for every account that is found in [accounts] sift through. 
        //Check to see if it is first a student that hasn't ever logged in yet  
        //then check to see if it is a student that has logged in more than once or a teacher.
        for (let i = 0; i < accounts.length; i++) {
            
            if (accounts[i].password === req.body.password) {

                //console.log("I get here");
                var token = jwt.sign({ id: accounts[i].id }, config.secret, {
                    expiresIn: 86400 // 24 hours
                });
                //this is causing the issue with seperate accounts.

                const role = await Student.find({
                    email: req.body.email,
                    password: req.body.password
                });

                return res.status(200).send({
                    id: accounts[i]._id,
                    email: accounts[i].email,
                    role: accounts[i].role,
                    name: "jeff",
                    homework: "y",
                    pastFirstTime: accounts[i].pastFirstTime,
                    accessToken: token,
                    account: role,
                });
            }
        }
        try {
            const accounts = await Account.find({
                email: req.body.email
            });
            
            for (let i = 0; i < accounts.length; i++) {
                console.log(i);
                console.log(accounts);
                console.log("I'm in", req.body.password);

                const AccountMatch = await Match(accounts[i], req.body.password); 
                console.log(AccountMatch);
                if (AccountMatch) {
                    console.log(AccountMatch);
                    var token = jwt.sign({ id: accounts[i].id }, config.secret, {
                        expiresIn: 86400 // 24 hours
                    });

                    if (accounts[i].role === "teacher") {
                        //console.log("id", accounts[i]);
                        const role = await User.findOne({
                            email: req.body.email,
                        });
                        //console.log(req.body.email);
                        return res.status(200).send({
                            id: accounts[i]._id,
                            email: accounts[i].email,
                            role: accounts[i].role,
                            firstname: role.firstname,
                            lastname: role.lastname,
                            //pastFirstTime: account.pastFirstTime,
                            accessToken: token,
                            account: accounts[i],
                            user: role,
                            about: role.about,
                            phone: role.phone,
                            login: true,
                        });
                    }

                    else {
                        
                        if (accounts[i].sep) {
                            console.log(accounts[i]);
                            const role = await Student.find({
                                email: req.body.email,
                                _id: accounts[i].account[0],
                            });
                            
                            return res.status(200).send({
                                id: accounts[i]._id,
                                email: accounts[i].email,
                                role: accounts[i].role,
                                name: "jeff",
                                homework: "y",
                                pastFirstTime: accounts[i].pastFirstTime,
                                accessToken: token,
                                account: role,

                            });
                        }
                        else {
                            console.log("i get here");

                            console.log(req.body.email);
                            const role = await Student.find({
                                email: req.body.email,
                                sep: false,
                            });
                            console.log(role);
                            return res.status(200).send({
                                id: accounts[i]._id,
                                email: accounts[i].email,
                                role: accounts[i].role,
                                name: "jeff",
                                homework: "y",
                                pastFirstTime: accounts[i].pastFirstTime,
                                accessToken: token,
                                account: role,

                            });
                        }
                        
                        
                        // I'm going to have to solve for the edge case of if the seperate but then they want to combine a different account.

                       
                    }
                }

            }
            return res.status(404).send({
                message: "user not found",
            })
        }


        catch (error) {
            try {
                console.log("yup", req.body);
            }
            catch {
                console.log("nope!");
            }
                }


            
        

    }

    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};
//logout user.
exports.logout = async (req, res) => {
    try {
    req.session = null;
    res.sendStatus(200);
} catch (error) {
    console.log(error);
    return res.sendStatus(500);
}
};
exports.getAllaccounts = async (req, res) => {
    try {

        if (req.body.email === "taylor@flinnapps.com" || req.body.password === "Samantha0320!") {

            let account = await Account.find();
            console.log(account);
            if (account) {
                return res.status(200).send(
                    account,
                )
            }
            else {
                return res.status(404).send({
                    message: "no Acccounts exist not found",
                })
            }
        }
        else {
            return res.status(404);
        }
    }
    
    catch {
        return res.status(404).send({
            message: "no Accounts exist",
        })
    }

}
exports.getAllusers = async (req, res) => {
    try {
        if (req.body.email === "taylor@flinnapps.com" || req.body.password === "Samantha0320!") {

            let user = await User.find();
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
        else {
            return res.status(404);
                
        }
    }
    catch {
        return res.status(404).send({
            message: "no Users exist not found",
        })
    }

}
function getuser(req){
    console.log(req)
    if(req.role==="teacher"){
        return({
            email: req.email,
        role: req.role,
        firstName: req.firstName,
        lastName: req.lastName,
        about: req.about,
        phone: req.phone,
        profilepic: req.profilepic,
        backgroundpic: req.backgroundpic,
        students: req.students,
        id: req._id
        })
        
    }
    else if(req.role==="student"){
        return({
            firstName: req.first,
        lastName: req.lastName,
		userID: req.userID,
        role: "student",
        pastFirstTime: req.pastFirstTime,
        scheduling: req.aschedule,
        day: req.day,
        newlyadded: req.newlyadded,
            homeworks: req.homeworks,
            mainGoal: req.mainGoal,
            daysbool: req.daysbool,
            timebool: req.timebool,
            starPoints: req.starPoints,
            level: req.level,
            starpoints: req.starpoints,
            starpointsGoal: req.starpointsGoal,
            mstarpoints: req.manualsetup,
            goals: req.goals,
            mainGoals: req.mainGoals,
            weekStreak: req.weekStreak,
            dayStreak: req.dayStreak,
            daystreak: req.daystreak,
            dayTotal: req.day1,
            totalDays: req.days,
            monthStart: req.smonths,
            monthEnd: req.emonths,
            timebiao: req.timeframePracticebiao,
            wmin: req.min,
            tsmonths: req.tsmonths,
            temonths: req.temonths,
            timeTotal: req.time1,
            finalTotalTime: req.finalTotalTime,
            time: req.yesnoTime,
            totalDaysPracticed:req.totalDaysPracticed,
            daysPracticed: req.daysPracticed,
            totalTime: req.totalTime,
            timeday: req.timeSync,
            hwtime: req.hwtime,
            min: req.weeklytimebiao,
            daybiao: req.dailytimebiao,
            dmin: req.dmin,
            totalWeekTime: req.totalWeekTime,
            checkboxes: req.checkbox,
            syncedCheckbox: req.syncCheckbox,
            syncedCheckboxes: req.syncedCheckboxes
        })
    }
}
const config = require("./auth.config");
const User = require("./users");
const argon2 = require("argon2");
const Student = require("./StudentSchema.js");
var jwt = require("jsonwebtoken");
const Account = require("./AccountSchema");

exports.cleargoals = async (req, res) => {
    console.log(req.body);
    /*
    try {
        await Student.updateOne({ _id: req.body.id }, {
            goals: [{}],
            maingoal: {}
        });
    }
    catch (error) {
        console.log(error);

    }
    */
}
exports.clearhw = async (req, res) => {
    console.log(req.body);
    /*
    try {
        await Student.updateOne({ _id: req.body.id }, {
            homeworks: [{}]
        });
    }
    catch (error) {
        console.log(error);

    }
    */
}
exports.cleararchive = async (req, res) => {
    console.log(req.body);
    /*
    try {
        await Student.updateOne({ _id: req.body.id }, {
            archive: [{}]
        });
    }
    catch (error) {
        console.log(error);

    }
    */
}

exports.getAccount = async (req, res) => {
    console.log(req.body);

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
exports.photoprac = async (req, res) => {
    console.log("i got here");
    var fs = require('fs');
    var FormData = require('form-data');
    var fs = require('fs');

    var form = new FormData();
    form.append('my_file', fs.createReadStream('./public/path.jpg'));
   
   
    return res.status(200).send({
        formdata: form,
    })


    
    

}
exports.changeAccountInfo = async (req, res) => {
    console.log(req.body);
    

    if (!req.body) {
        return res.status(400).send({
            message: "No Data Changed"
        });
    }

    try {

        
        if (req.body.email) {
            
            
                await Account.updateOne({ _id: req.body.id }, {
                    email: req.body.email
                });
            

        };
        if (req.body.password) {
            var cryptpass = await argon2.hash(req.body.password);

            await Account.updateOne({ _id: req.body.id }, {
                password: cryptpass
            });

        };
      

       
       

    }

    catch {
        console.log("I got here");
    }
};

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
exports.changeuserinfoA = async (req, res) => {
    console.log(req.body);
    
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
        
        if (req.body.email) {
            await User.updateOne({ _id: req.body.id }, {
                email : req.body.email
            });
           
            
        }
        if (req.body.password) {
            var cryptpass = await argon2.hash(req.body.password);

            await User.updateOne({ _id: req.body.id }, {
                password: cryptpass
            });

        };

        
    }
    catch {
        console.log("I got here");
    }
};
exports.changeStudentinfoA = async (req, res) => {
    console.log(req.body);
    
    if (!req.body) {
        return res.status(400).send({
            message: "No Data Changed"
        });
    }

    try {

        if (req.body.firstname) {
           
            await Student.updateOne({ _id: req.body.id }, {
                firstName: req.body.firstname
            });

        };
        if (req.body.lastname) {

            await Student.updateOne({ _id: req.body.id }, {
                lastName: req.body.lastname
            });

        };

        if (req.body.password) {
            var cryptpass = await argon2.hash(req.body.password);

            await Student.updateOne({ _id: req.body.id }, {
                password: cryptpass
            });

        };

        if (req.body.checkbox) {

            await Student.updateOne({ _id: req.body.id }, {
                checkboxes: req.body.checkbox
            });

        };
        if (req.body.email) {

            
            await Student.updateOne({ _id: req.body.id }, {
                    email: req.body.email
                });
            
           
        }


       

    }
    catch {

        console.log("I got here");
    }
};
exports.admindelete = async (req, res) => {
    const student = await Student.findOne({ _id: req.body.id });
    const account = await Account.findOne({ _id: req.body.id });
    const user = await User.findOne({ _id: req.body.id });
    if (student) {
        Student.deleteOne({ _id: req.body.id, }, function (err) {
            if (err) console.log(err);
            console.log("Successful deletion");
        });
    }

    if (account) {
        Account.deleteOne({ _id: req.body.id, }, function (err) {
            if (err) console.log(err);
            console.log("Successful deletion");
        });
    }

    if (user) {
        User.deleteOne({ _id: req.body.id, }, function (err) {
                if (err) console.log(err);
                console.log("Successful deletion");
            });

    }

}

    


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
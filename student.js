const User = require("./users.js");
const Student = require("./StudentSchema.js");
const argon2 = require("argon2");
const Account = require("./AccountSchema");

//Controlls fuctionality needed for students.

var generator = require('generate-password');

var password = generator.generate({
    length: 10,
    numbers: true
});

exports.getstudent = async (req, res) => {
    console.log(req.body);
    const existingUser = await Student.findOne({
        _id: req.body.id
    });
    if (existingUser) {
        //console.log(existingUser);
        return res.status(200).send({
            student: existingUser,
        })
    }

}

exports.changeactivestudent = async (req, res) => {
    console.log(req.body);
    if (req.body.id !== req.body.id2) {
        await Student.updateOne({ _id: req.body.id }, {
            active: false,
        });
        await Student.updateOne({ _id: req.body.id2 }, {
            active: true,
        });
    }
    
   

}
exports.daysPracticed = async (req, res) => {
    console.log(req.body);
    let student = Student.findOne({_id: req.body.id});
    let update; 
    if(parseInt(student.daysPracticed)>parseInt(req.body.daysPracticed)){
        update = parseInt(student.totalDaysPracticed) - 1;
    }
    else{
    update = parseInt(student.totalDaysPracticed) + 1;
    }
    await Student.updateOne({ _id: req.body.id }, {
        daysPracticed: req.body.daysPracticed,
        totalDaysPracticed: update
    });


};
exports.starPoints = async (req, res) => {
    console.log(req.body);
    if (req.body.manual) {
        await Student.updateOne({ _id: req.body.id }, {
            starPoints: true
        });

    }
    else {
        await Student.updateOne({ _id: req.body.id }, {
            starPoints: false
        });
    }
    


};

exports.totalDays = async (req, res) => {
    
    console.log(req.body);


    await Student.updateOne({ _id: req.body.id }, {
        totalDays: req.body.totalDays,
        monthStart: req.body.monthStart,
        monthEnd: req.body.monthEnd,
        timebiao: req.body.timebiao,
        wmin: req.body.min,
        tsmonths: req.body.tsmonths,
        temonths: req.body.temonths,

    });


};
exports.setDayStreak = async (req, res) => {

    console.log(req.body);


    await Student.updateOne({ _id: req.body.id }, {
        dayStreak: req.body.streak,

    });


};
exports.setWeekStreak = async (req, res) => {

    console.log(req.body);


    await Student.updateOne({ _id: req.body.id }, {
        weekStreak: req.body.streak,

    });


};
exports.dayTotal = async (req, res) => {
    console.log(req.body);

    await Student.updateOne({ _id: req.body.id }, {
        dayTotal: req.body.total
    });


};


exports.checked = async (req, res) => {
    console.log(req.body);

    await Student.updateOne({ _id: req.body.id }, {
        checked: req.body.checked,
        daystreak: req.body.daystreak,
    });
    if(req.body.pass){
        console.log("what about here?")
        extra= await levelcalc(req.body.id, req.body.starpointsGoal, req.body.sp, req.body.level,req.body.npass);
        await Student.updateOne({ _id: req.body.id }, {
            
            starpoints: extra
         
     })

    }
    else{
        console.log(req.body.sp)
        await Student.updateOne({ _id: req.body.id }, {
            
               starpoints: req.body.sp
            
        })
    
    }
   

};
exports.checkbox = async (req, res) => {
    console.log(req.body);

    await Student.updateOne({ _id: req.body.id }, {
        checkboxes: req.body.checkbox
    });


};

exports.changeStudentinfo = async (req, res) => {
    console.log("changed info:", req.body);
    if (!req.body) {
        return res.status(400).send({
            message: "No Data Changed"
        });
    }

    try {

        if (req.body.firstname) {
            //console.log(req.body.firstname);
            console.log(req.body.firstname);
            await Student.updateOne({ _id: req.body.id }, {
                firstName: req.body.firstname
            });

        };
        if (req.body.lastname) {
            console.log(req.body.lastname);

            await Student.updateOne({ _id: req.body.id }, {
                lastName: req.body.lastname
            });

        };
        if (req.body.time) {
            console.log(req.body.time);

            let aschedule = "";
            for (let i = 0; i < req.body.time.length; i++) {
                if (req.body.time[i] !== ":") {
                    if (i === 0 && req.body.time[i] !== "0") {
                        aschedule = aschedule + req.body.time[i];
                    }
                    else if (i > 0) {
                        aschedule = aschedule + req.body.time[i];
                    }
                }

            }
            await Student.updateOne({ _id: req.body.id }, {
                scheduling: aschedule
            });

        };
        if (req.body.checkbox) {
            console.log(req.body.checkbox);

            await Student.updateOne({ _id: req.body.id }, {
                checkboxes: req.body.checkbox
            });

        };
        if (req.body.email) {
            console.log("email");
            if (req.body.accountid) {
                console.log(req.body.accountid);

                await Account.updateOne({ _id: req.body.accountid }, {
                    email: req.body.email

                });

                let accountchanges = await Account.findOne({ _id: req.body.accountid });
                console.log(accountchanges);

                for (let k = 0; k < accountchanges.account.length; k++) {
                    console.log(accountchanges.account[k]);

                    await Student.updateOne({ _id: accountchanges.account[k]._id }, {
                        email: req.body.email
                    });
                }
                
            }
            else {
                const existingstudent = await Student.findOne({
                    _id: req.body.id
                });


                let accountchange = await Account.find({ email: existingstudent.email, sep: false });
                let rightaccount;
                for (let i = 0; i < accountchange.length; i++) {

                    for (let j = 0; j < accountchange[i].account.length; j++) {
                        

                        if (accountchange[i].account[j]._id.toString() === req.body.id.toString()) {
                            rightaccount = accountchange[i]._id;
                            await Account.updateOne({ _id: accountchange[i]._id }, {
                                email: req.body.email

                            });
                            
                            
                        }
                       

                    }
                }

                let accountchanges = await Account.findOne({ _id: rightaccount });
                for (let k = 0; k < accountchanges.account.length; k++) {
                    console.log(accountchanges.account[k]._id);

                    
                    await Student.updateOne({ _id: accountchanges.account[k]._id }, {
                        email: req.body.email
                    });
                }

                
            }
          
        };
        
        if (req.body.phone) {
            console.log(req.body.phone);

            await Student.updateOne({ _id: req.body.id }, {
                phone: req.body.phone
            });

        };
        if (req.body.day) {
            console.log(req.body.day);

            await Student.updateOne({ _id: req.body.id }, {
                day: req.body.day
            });

        };
        if (req.body.about) {
            console.log(req.body.about);

            await Student.updateOne({ _id: req.body.id }, {
                about: req.body.about
            });

        };
        

        const changed = await Student.findOne({
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

exports.doitAll = async (req, res) => {
    //console.log(req.body);
    if (req.body.maingoal !== "") {
        await Student.updateOne({ _id: req.body.id }, {
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
            weekStreak: req.body.weekStreak,
            //weekstreak: "0", this could be an option for gamification later.
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
            },





        })
    }
    else {
        await Student.updateOne({ _id: req.body.id }, {
            newlyadded: false,
            homeworks: req.body.homeworks,
            
            starPoints: req.body.starPoints,
            mstarpoints: req.body.manualsetup,
            level: "0",
            starpoints: "0",
            starpointsGoal: "100",
            goals: req.body.goals,
            weekStreak: req.body.weekStreak,
            daysbool: req.body.daysbool,
            timebool: req.body.timebool,
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
            totalTime: "0",
            totalDaysPracticed:"0",
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
            },
        })
    }

    let student = await Student.findOne({
        _id: req.body.id,
    });

    return res.status(200).send({
        student: student,

    });

}

exports.editalltheProgress = async (req, res) => {
    try {
        console.log(req.body);
        let student= await Student.findOne({_id: req.body.id});
        if (student.starPoints===false){
            await Student.updateOne({ _id: req.body.id }, {
               
                starPoints: req.body.starPoints,
                starpoints: "0"
                
                

            })

        }
        else{
            await Student.updateOne({ _id: req.body.id }, {
               
                starPoints: req.body.starPoints,
                
               

            })

        }


        
            await Student.updateOne({ _id: req.body.id }, {
               
                daysbool: req.body.daysbool,
                timebool: req.body.timebool,

            })
        
      
        if (req.body.temppracticegoal) {
            if(req.body.temppracticegoal==="cancelday"){
                await Student.updateOne({ _id: req.body.id }, {
               
                    totalDays: "",
                })
            }
            else{
            await Student.updateOne({ _id: req.body.id }, {
               
                totalDays: req.body.totalDays,
            })
        }
        }
        if (req.body.temptimegoal) {
            if(req.body.temptimegoal==="canceltime"){
                await Student.updateOne({ _id: req.body.id }, {
               
                    wmin: "",
                })
            }
            else{
            await Student.updateOne({ _id: req.body.id }, {
                wmin: req.body.totalTime
            })
        }
        }
        if (req.body.tempsmonths) {
            await Student.updateOne({ _id: req.body.id }, {
               
                monthStart: req.body.tempsmonths,
               
            })
        }
        if (req.body.tempemonths) {
            await Student.updateOne({ _id: req.body.id }, {
                
                monthEnd: req.body.tempemonths,
                
            })
        }
        if (req.body.temptsmonths) {
            await Student.updateOne({ _id: req.body.id }, {
               
                tsmonths: req.body.temptsmonths,
                
            })
        }
        if (req.body.temptemonths) {
            await Student.updateOne({ _id: req.body.id }, {
                temonths: req.body.temptemonths,
                
            })
        }
       


    }
    catch {
        return res.status(404).send({
            message: "no students exist not found",
        })
    }
}
exports.getAllstudents = async (req, res) => {
    try {
        if (req.body.email === "taylor@flinnapps.com" || req.body.password === "Samantha0320!") {

            let student = await Student.find();

            if (student) {
               

                return res.status(200).send(
                    student,
                );
            }
            
            else {
                return res.status(404).send({
                    message: "no students exist not found",
                })
            }
        }
        else {
            return res.status(404)
        }
    }
    catch {
        return res.status(404).send({
            message: "no students exist not found",
        })
    }

}
exports.addstudent = async (req, res) => {
    try {
        const pass = password;

        //console.log(req.body.double);
        //edge case for when two students are on one account.
        if (req.body.double) {
            await Student.updateOne({ email: req.body.email }, {
                doubleAccount: true,

            });

            //console.log("igothere", req.body);

            let aschedule = "";
            for (let i = 0; i < req.body.time.length; i++) {
                if (req.body.time[i] !== ":") {
                    if (i === 0 && req.body.time[i] !== "0") {
                        aschedule = aschedule + req.body.time[i];
                    }
                    else if (i > 0) {
                        aschedule = aschedule + req.body.time[i];
                    }
                }

            }
            //console.log(aschedule);

            const student = new Student({
                firstName: req.body.first,
                lastName: req.body.last,
                email: req.body.email,
                lesson: "lesson",
                teacherID: req.body.user.account._id,
                userID: req.body.user.id,
                role: "student",
                password: pass,
                homework: "my homework",
                pastFirstTime: false,
                doubleAccount: true,
                scheduling: aschedule,
                checkboxes: req.body.checkbox,
                day: req.body.day,
                sep: false,
                active: false,
                newlyadded: true,
            });




            await student.save();

            //update array within the teacher schema
            await User.updateOne({
                _id: req.body.user.id
            }, {
                $push: { students: student }
            }
            );
            //Update account or add account for student.
            const findaccount = await Account.findOne({
                email: req.body.email,
                sep: false,
                role: "student",
            });
            if (findaccount) {
                await Account.updateOne({
                    email: req.body.email,
                    sep: false,
                }, {
                    $push: { account: student }
                }
                );
            }

            else {
                const account = new Account({
                    email: req.body.email,
                    teacherID: req.body.teacherID,
                    password: pass,
                    role: "student",
                    pastFirstTime: false,
                    sep: false,
                });
                await account.save();

                const saveStudent = await Student.find({ email: req.body.email });
                for (i = 0; i < saveStudent.length; i++) {
                    await Account.updateOne({
                        email: req.body.email
                    }, {
                        $push: { students: saveStudent[i] }
                    }
                    );
                }

            }

            await Student.updateMany({ email: req.body.email }, { password: pass });
            //the above was for an edge case where you may have two students with same account.



            const newstudentc = await Student.findOne({ email: req.body.email, firstName: req.body.first })


            return res.status(200).send({
                _id: newstudentc._id,
                firstName: newstudentc.firstName,
                lastName: newstudentc.lastName,
                email: newstudentc.email,
                teacherID: newstudentc.teacherID,
                userID: newstudentc.userID,
                role: newstudentc.role,
                pastFirstTime: newstudentc.pastFirstTime,
                doubleAccount: newstudentc.doubleAccount,
                scheduling: newstudentc.scheduling,
                checkboxes: newstudentc.checkboxes,
                password: newstudentc.password,
                day: newstudentc.day,
                sep: newstudentc.sep,
                active: newstudentc.active,
                newlyadded: newstudentc.newlyadded,


            });

        }
        if (req.body.separate) {


            console.log("igothere", req.body);

            let aschedule = "";
            for (let i = 0; i < req.body.time.length; i++) {
                if (req.body.time[i] !== ":") {
                    if (i === 0 && req.body.time[i] !== "0") {
                        aschedule = aschedule + req.body.time[i];
                    }
                    else if (i > 0) {
                        aschedule = aschedule + req.body.time[i];
                    }
                }

            }
            //console.log(aschedule);

            const student = new Student({
                firstName: req.body.first,
                lastName: req.body.last,
                email: req.body.email,
                lesson: "lesson",
                teacherID: req.body.user.account._id,
                userID: req.body.user.id,
                password: pass + req.body.first + req.body.checkbox,
                role: "student",
                homework: "my homework",
                pastFirstTime: false,
                doubleAccount: false,
                scheduling: aschedule,
                checkboxes: req.body.checkbox,
                sep: true,
                active: true,
                day: req.body.day,
                newlyadded: true,

            });




            await student.save();

            //update array within the teacher schema
            await User.updateOne({
                _id: req.body.user.id
            }, {
                $push: { students: student }
            }
            );
            //Update account or add account for student.

            const account = new Account({
                email: req.body.email,
                teacherID: req.body.teacherID,
                password: pass + req.body.first + req.body.checkbox,
                role: "student",
                sep: true,
                pastFirstTime: false,
            });
            await account.save();
            //solve for if you want 3 seperate students. 
            const saveStudent3 = await Student.find({ email: req.body.email, password: pass + req.body.first + req.body.checkbox });
            for (i = 0; i < saveStudent3.length; i++) {
                await Account.updateOne({
                    email: req.body.email,
                    password: pass + req.body.first + req.body.checkbox,
                }, {
                    $push: { account: saveStudent3[i] }
                }
                );
            }

            const newstudent0 = await Student.findOne({ email: req.body.email, firstName: req.body.first })


            return res.status(200).send({
                _id: newstudent0._id,
                firstName: newstudent0.firstName,
                lastName: newstudent0.lastName,
                email: newstudent0.email,
                teacherID: newstudent0.teacherID,
                userID: newstudent0.userID,
                role: newstudent0.role,
                pastFirstTime: newstudent0.pastFirstTime,
                doubleAccount: newstudent0.doubleAccount,
                scheduling: newstudent0.scheduling,
                checkboxes: newstudent0.checkboxes,
                password: newstudent0.password,
                day: newstudent0.day,
                sep: newstudent0.sep,
                active: newstudent0.active,
                newlyadded: newstudent0.newlyadded,


            });

        }

        let existing_email = await Student.findOne({
            email: req.body.email,
        });
        //needed for popup on the front end.
        if (existing_email && !req.body.double && !req.body.separate) {
            //console.log("I got here");
            return res.send({
                existing_email: true,
            });

        }

        //normal student adding for non double accounts.
        let aschedule = "";
        for (let i = 0; i < req.body.time.length; i++) {
            if (req.body.time[i] !== ":") {
                if (i === 0 && req.body.time[i] !== "0") {
                    aschedule = aschedule + req.body.time[i];
                }
                else if (i > 0) {
                    aschedule = aschedule + req.body.time[i];
                }
            }

        }
        //console.log(req.body.user);
        const student = new Student({
            firstName: req.body.first,
            lastName: req.body.last,
            email: req.body.email,
            lesson: "lesson",
            teacherID: req.body.user.account._id,
            userID: req.body.user.id,
            password: pass,
            role: "student",
            homework: "my homework",
            pastFirstTime: false,
            doubleAccount: false,
            scheduling: aschedule,
            checkboxes: req.body.checkbox,
            day: req.body.day,
            sep: false,
            active: true,
            newlyadded: true,

        });
        //console.log(req.body);
        await student.save();

        await User.updateOne({
            _id: req.body.id
        }, {
            $push: { students: student }
        }
        );

        const account = new Account({
            email: req.body.email,
            teacherID: req.body.teacherID,
            password: pass,
            role: "student",
            pastFirstTime: false,
            sep: false,
        });
        await account.save();

        const saveStudent = await Student.find({ email: req.body.email });
        for (i = 0; i < saveStudent.length; i++) {
            await Account.updateOne({
                email: req.body.email
            }, {
                $push: { account: saveStudent[i] }
            }
            );
        }

        const newstudent = await Student.findOne({ email: req.body.email, firstName: req.body.first })
        return res.status(200).send({
            _id: newstudent._id,
            firstName: newstudent.firstName,
            lastName: newstudent.lastName,
            email: newstudent.email,
            teacherID: newstudent.teacherID,
            userID: newstudent.userID,
            role: newstudent.role,
            pastFirstTime: newstudent.pastFirstTime,
            doubleAccount: newstudent.doubleAccount,
            scheduling: newstudent.scheduling,
            checkboxes: newstudent.checkboxes,
            password: newstudent.password,
            day: newstudent.day,
            sep: newstudent.sep,
            active: newstudent.active,
            newlyadded: newstudent.newlyadded,


        });

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};

exports.AddGoals = async (req, res) => {
    try {
        console.log(req.body);
        
        if (req.body.goals) {
            if (req.body.main) {
                await Student.updateOne({ _id: req.body.id }, {
                    mainGoal: req.body.goals,
                })
            }
            else {

                await Student.updateOne({ _id: req.body.id }, {
                    goals: req.body.goals,
                })
            }
        }
    }
    catch (error) {
        console.log(error);

    }

}
exports.AddHomeworks = async (req, res) => {
    try {
        console.log(req.body);
        if (req.body.homeworks) {


            await Student.updateOne({ _id: req.body.id }, {
                homeworks: req.body.homeworks,
            })
        }
    }
    catch (error) {
        console.log(error);

    }

}
exports.doneUpdatingnewStudent = async (req, res) => {
    try {
        if (req.body.done) {
            await Student.updateOne({ _id: req.body.id }, {
                newlyadded: false,
            })


        }

        let student = await Student.findOne({
            _id: req.body.id,
        });

        return res.status(200).send({
            student: student,
           
        });

    }
    catch (error) {
        console.log(error);

    }
}
    
exports.clearTime = async (req, res) => {
    console.log(req.body);
    try {
        
            await Student.updateOne({ _id: req.body.id }, {
                hwtime: {
                    mon: "0",
                    tues: "0",
                    wed: "0",
                    thur: "0",
                    fri: "0",
                    sat: "0",
                    sun: "0",
                },
                totalWeekTime: {
                    total: "0"
                }
            });
   
    }
    catch (error) {
        console.log(error);

    }
}

exports.clearChecks = async (req, res) => {
    try {
        if (req.body.homework) {
            await Student.updateOne({ _id: req.body.id }, {
                syncedCheckboxes: {
                    mon: false,
                    tues: false,
                    wed: false,
                    thur: false,
                    fri: false,
                    sat: false,
                    sun: false,
                }
            });
        }
        else {
            await Student.updateOne({ _id: req.body.id }, {
                checked: "0"
            });
        }
    }
    catch (error){
        console.log(error);

    }
}
exports.clearhwChecks = async (req, res) => {
    try {
        console.log(req.body);
        if (req.body.homework) {
            await Student.updateOne({ 'homeworks._id': req.body.id }, {
                '$set': {
                    'homeworks.$.syncedCheckboxes': {
                        mon: false,
                        tues: false,
                        wed: false,
                        thur: false,
                        fri: false,
                        sat: false,
                        sun: false,



                    },
                }
            })
          
        }
        else {
            await Student.updateOne({ 'homeworks._id': req.body.id }, {
                '$set': {
                    'homeworks.$.hwchecked': "0",
                }
            })

        }
    }
    catch (error) {
        console.log(error);

    }
}
exports.clearhwTime = async (req, res) => {
    await Student.updateOne({ 'homeworks._id': req.body.id }, {
        '$set': {
            'homeworks.$.hwtime': {
                mon: "0",
                tues: "0",
                wed: "0",
                thur: "0",
                fri: "0",
                sat: "0",
                sun: "0",



            },
            'homeworks.$.totalWeekTime': {
                total: "0",
            },
        }
    })

}


exports.hwchecked = async (req, res) => {
    try {
        console.log(req.body);

            await Student.updateOne({ 'homeworks._id': req.body.homework }, {
                '$set': {
                    'homeworks.$.hwchecked': req.body.practice,
                }


            }
            )
            if(req.body.pass){
                extra= await levelcalc(req.body.id, req.body.starpointsGoal, req.body.sp, req.body.level,);
        await Student.updateOne({ _id: req.body.id }, {
            
            starpoints: extra
         
     })
            }
            else{
                await Student.updateOne({ _id: req.body.id }, {
                    
                       starpoints: req.body.sp
                    
                })
            
            }
       
        
    }
    catch (error) {
        console.log(error);

    }
}

exports.getthem = async (req, res) => {
    //allows the front end teacher to access all of their students.
    try {

        //console.log("lets try this", req.body);

       

       
        //console.log(req.body);


        let student = await Student.find({
            teacherID: req.body.user,
        });
        //console.log(student);
        if (req.body.studentList) {
            student.sort((a, b) => {
                let fa = a.lastName.toLowerCase(),
                    fb = b.lastName.toLowerCase();

                if (fa < fb) {
                    return -1;
                }
                if (fa > fb) {
                    return 1;
                }
                return 0;
            });
        }

        
        else {
            student.sort(function (a, b) {

                return a.scheduling - b.scheduling;
            });
        }
        
       
        return res.send(student);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}





exports.addHomwork = async (req, res) => {
    //allows teacher to add homework for students.
    try {
        console.log(req.body);
        if (req.body.type === "") {
            await Student.updateOne({ _id: req.body.id }, {
                $push: {
                    homeworks: {
                       
                        hwtype: "assignment",

                        title: req.body.homework,
                        hwchecked: "0",
                        hwcheckboxes: req.body.hwcheckboxes,
                        description: req.body.description,
                        daily: req.body.day,
                        hwsynccheck: req.body.hwsynccheck,
                        hwtime: req.body.hwtime,
                        hwlink: req.body.hwlink,
                        hwdmin: req.body.hwdmin,
                        HWweeklytimebiao: req.body.HWweeklytimebiao,
                        hwtimesync: req.body.hwtimesync,
                        hwstruggles: req.body.struggles,
                        hwQuestions: req.body.hwQuestions,
                        syncedCheckboxes: {
                            mon: false,
                            tues: false,
                            wed: false,
                            thur: false,
                            fri: false,
                            sat: false,
                            sun: false,
                        },
                        hwtime: {
                            mon: "0",
                            tues: "0",
                            wed: "0",
                            thur: "0",
                            fri: "0",
                            sat: "0",
                            sun: "0",
                        },
                        totalWeekTime: {
                            total: "0",
                        },
                        firstMessage: true,
                        yesnoday: req.body.hwdailytimebiao,
                        yesnoweek: req.body.hwtimew,

                        date: req.body.date,


                    }

                }
            }
            )
        }
        if (req.body.type === "assignment") {
            await Student.updateOne({ _id: req.body.id }, {
                $push: {
                    homeworks: {
                        title: req.body.homework,
                        hwtype: req.body.type,
                        hwchecked: "0",
                        hwcheckboxes: req.body.hwcheckboxes,
                        description: req.body.description,
                        daily: req.body.day,
                        hwsynccheck: req.body.hwsynccheck,
                        hwtime: req.body.hwtime,
                        hwlink: req.body.hwlink,
                        hwdmin: req.body.hwdmin,
                        HWweeklytimebiao: req.body.HWweeklytimebiao,
                        hwtimesync: req.body.hwtimesync,
                        hwstruggles: req.body.struggles,
                        hwQuestions: req.body.hwQuestions,
                        syncedCheckboxes: {
                            mon: false,
                            tues: false,
                            wed: false,
                            thur: false,
                            fri: false,
                            sat: false,
                            sun: false,
                        },
                        hwtime: {
                            mon: "0",
                            tues: "0",
                            wed: "0",
                            thur: "0",
                            fri: "0",
                            sat: "0",
                            sun: "0",
                        },
                        totalWeekTime: {
                            total: "0",
                        },
                        firstMessage: true,
                        yesnoday: req.body.hwdailytimebiao,
                        yesnoweek: req.body.hwtimew,

                        date: req.body.date,


                    }

                }
            }
            )
        }
        if (req.body.type === "practice") {
            console.log("practice", req.body)
            await Student.updateOne({ _id: req.body.id }, {
                $push: {
                    homeworks: {
                        title: req.body.homework,
                        hwtype: req.body.type,
                        hwchecked: "0",
                        hwcheckboxes: req.body.hwcheckboxes,
                        description: req.body.description,
                        daily: req.body.day,
                        hwsynccheck: req.body.hwsynccheck,
                        hwtime: req.body.hwtime,
                        hwlink: req.body.hwlink,
                        hwdmin: req.body.hwdmin,
                        HWweeklytimebiao: req.body.HWweeklytimebiao,
                        hwtimesync: req.body.hwtimesync,
                        hwstruggles: req.body.struggles,
                        hwQuestions: req.body.hwQuestions,
                        syncedCheckboxes: {
                            mon: false,
                            tues: false,
                            wed: false,
                            thur: false,
                            fri: false,
                            sat: false,
                            sun: false,
                        },
                        hwtime: {
                            mon: "0",
                            tues: "0",
                            wed: "0",
                            thur: "0",
                            fri: "0",
                            sat: "0",
                            sun: "0",
                        },
                        totalWeekTime: {
                            total: "0",
                        },
                        firstMessage: true,
                        yesnoday: req.body.hwdailytimebiao,
                        yesnoweek: req.body.hwtimew,
                        
                    }
                }
            }
            )
        }
        if (req.body.type === "research") {
            await Student.updateOne({ _id: req.body.id }, {
                $push: {
                    homeworks: {
                        title: req.body.homework,
                        hwtype: req.body.type,
                        hwchecked: "0",
                        hwcheckboxes: req.body.hwcheckboxes,
                        description: req.body.description,
                        daily: req.body.day,
                        hwsynccheck: req.body.hwsynccheck,
                        hwtime: req.body.hwtime,
                        hwlink: req.body.hwlink,
                        hwdmin: req.body.hwdmin,
                        HWweeklytimebiao: req.body.HWweeklytimebiao,
                        hwtimesync: req.body.hwtimesync,
                        hwstruggles: req.body.struggles,
                        hwQuestions: req.body.hwQuestions,
                        syncedCheckboxes: {
                            mon: false,
                            tues: false,
                            wed: false,
                            thur: false,
                            fri: false,
                            sat: false,
                            sun: false,
                        },
                        hwtime: {
                            mon: "0",
                            tues: "0",
                            wed: "0",
                            thur: "0",
                            fri: "0",
                            sat: "0",
                            sun: "0",
                        },
                        totalWeekTime: {
                            total: "0",
                        },
                        firstMessage: true,
                        yesnoday: req.body.hwdailytimebiao,
                        yesnoweek: req.body.hwtimew,
                        research: req.body.hwreasearch,
                        date: req.body.date,

                    }
                }
            }
            )
        }
        
    }
        catch (err) {
            console.log(err);
        }
}
exports.hwmessage = async (req, res) => {

    console.log(req.body);
    try {
    await Student.updateOne({ 'homeworks._id': req.body.id }, {
        '$set': {
            'homeworks.$.firstMessage': false,
        },
        
        $push: {

            
                    'homeworks.$.messages': {
                        m: req.body.message,
                        date: req.body.date,
                        role: req.body.role,

                    }
                


            }
        }
    )
    }


catch {
        console.log("yeah no");
}

    


}
exports.addgoal = async (req, res) => {
    //allows teacher to add homework for students.
    try {
        console.log(req.body);
        if (req.body.mainGoal) {
            await Student.updateOne({ _id: req.body.id }, {

                mainGoal: {
                    title: req.body.goal,
                    description: req.body.description,
                    date: req.body.date,
                    complete: false,


                }


            }
            )
        }
        else {
            console.log(req.body);

            await Student.updateOne({ _id: req.body.id }, {
                
                $push: {
                    goals: {
                        title: req.body.goal,
                        description: req.body.description,
                        daily: req.body.day,
                        complete: false,

                    }
                }
            })






        }
    }
    catch (err) {
        console.log(err);
    }
}
exports.changeweek = async (req, res) => {
    console.log(req.body);
    let timeTotal= parseInt(req.body.time)+parseInt(req.body.timeTotal)
    let totalWeekTime= parseInt(req.body.time)+parseInt(req.body.totalWeekTime)
    await Student.updateOne({ _id: req.body.id }, {
        finalTotalTime: timeTotal,
        timeTotal: timeTotal,
        totalWeekTime: {
            total: totalWeekTime,

        },
    })
    if(req.body.pass){

        extra= await levelcalc(req.body.id, req.body.starpointsGoal, req.body.sp, req.body.level,);
        console.log(extra)
        await Student.updateOne({ _id: req.body.id }, {
            
            starpoints: extra
         
     })
    }
    else{
        await Student.updateOne({ _id: req.body.id }, {
            
               starpoints: req.body.sp
            
        })
    
    }
}
exports.hwchangeweek = async (req, res) => {
    await Student.updateOne({ 'homeworks._id': req.body.id }, {
        '$set': {
            'homeworks.$.totalWeekTime': {
                total: req.body.time,}
           
        },

        

        
    })
}



exports.hwchangetimes = async (req, res) => {
    console.log(req.body);
    console.log("thisisit");




    


    if (req.body.day === "mon") {
        console.log(req.body.day);

        await Student.updateOne({ 'homeworks._id': req.body.id }, {
            '$set': {
                'homeworks.$.hwtime': {
                    mon: req.body.time,
                    tues: req.body.syncedhw.tues,
                    wed: req.body.syncedhw.wed,
                    thur: req.body.syncedhw.thur,
                    fri: req.body.syncedhw.fri,
                    sat: req.body.syncedhw.sat,
                    sun: req.body.syncedhw.sun,




                },
            }
        })
    }
    if (req.body.day === "tues") {
        await Student.updateOne({ 'homeworks._id': req.body.id }, {
            '$set': {
                'homeworks.$.hwtime': {
                    mon: req.body.syncedhw.mon,
                    tues: req.body.time,
                    wed: req.body.syncedhw.wed,
                    thur: req.body.syncedhw.thur,
                    fri: req.body.syncedhw.fri,
                    sat: req.body.syncedhw.sat,
                    sun: req.body.syncedhw.sun,




                },
            }
        })
    }
    if (req.body.day === "wed") {
        await Student.updateOne({ 'homeworks._id': req.body.id }, {
            '$set': {
                'homeworks.$.hwtime': {
                    mon: req.body.syncedhw.mon,
                    tues: req.body.syncedhw.tues,
                    wed: req.body.time,
                    thur: req.body.syncedhw.thur,
                    fri: req.body.syncedhw.fri,
                    sat: req.body.syncedhw.sat,
                    sun: req.body.syncedhw.sun,




                },
            }
        })
    }
    if (req.body.day === "thur") {
        await Student.updateOne({ 'homeworks._id': req.body.id }, {
            '$set': {
                'homeworks.$.hwtime': {
                    mon: req.body.syncedhw.mon,
                    tues: req.body.syncedhw.tues,
                    wed: req.body.syncedhw.wed,
                    thur: req.body.time,
                    fri: req.body.syncedhw.fri,
                    sat: req.body.syncedhw.sat,
                    sun: req.body.syncedhw.sun,




                },
            }
        })
    }
    if (req.body.day === "fri") {
        await Student.updateOne({ 'homeworks._id': req.body.id }, {
            '$set': {
                'homeworks.$.hwtime': {
                    mon: req.body.syncedhw.mon,
                    tues: req.body.syncedhw.tues,
                    wed: req.body.syncedhw.wed,
                    thur: req.body.syncedhw.thur,
                    fri: req.body.time,
                    sat: req.body.syncedhw.sat,
                    sun: req.body.syncedhw.sun,




                },
            }
        })
    }
    if (req.body.day === "sat") {
        await Student.updateOne({ 'homeworks._id': req.body.id }, {
            '$set': {
                'homeworks.$.hwtime': {
                    mon: req.body.syncedhw.mon,
                    tues: req.body.syncedhw.tues,
                    wed: req.body.syncedhw.wed,
                    thur: req.body.syncedhw.thur,
                    fri: req.body.syncedhw.fri,
                    sat: req.body.time,
                    sun: req.body.syncedhw.sun,




                },
            }
        })
    }
    if (req.body.day === "sun") {


        await Student.updateOne({ 'homeworks._id': req.body.id }, {
            '$set': {
                'homeworks.$.hwtime': {
                    mon: req.body.syncedhw.mon,
                    tues: req.body.syncedhw.tues,
                    wed: req.body.syncedhw.wed,
                    thur: req.body.syncedhw.thur,
                    fri: req.body.syncedhw.fri,
                    sat: req.body.syncedhw.sat,
                    sun: req.body.time,




                },
            }
        })
    }
}

exports.changetimes = async (req, res) => {



    console.log(req.body);
    let student = await Student.findOne({ _id: req.body.id });
    let sub= student.hwtime[req.body.day];
    console.log(sub)
    let add= req.body.time;
    console.log(add)
    let timeTotal= (parseInt(student.timeTotal)- parseInt(sub))+ parseInt(add);
    let finalTotalTime= (parseInt(student.finalTotalTime)- parseInt(sub))+ parseInt(add);

    let weektime = (parseInt(student.totalWeekTime.total) - parseInt(sub)) + parseInt(add);
    
    
    

        
    
    console.log(timeTotal)
    
    //let total = parseInt(req.body.time) + parseInt(student.totalTime);
    
    //console.log(weektime);

    //let timeTotal= (parseInt(student.hwtime.[req.body.day]) -  parseInt(req.body.time))+parseInt(req.body.timeTotal)
    //console.log(timeTotal);
    await Student.updateOne({ _id: req.body.id }, {
        finalTotalTime: finalTotalTime.toString(),
        timeTotal: timeTotal.toString(),
        totalWeekTime: {
            total: weektime.toString()
        },
     
        
        daystreak: req.body.daystreak
    })
    let extra;
    if(req.body.pass){
        extra= await levelcalc(req.body.id, req.body.starpointsGoal, req.body.sp, req.body.level, req.body.npass);
        await Student.updateOne({ _id: req.body.id }, {
            
            starpoints: extra,
            


         
     })
    }
    else{
        await Student.updateOne({ _id: req.body.id }, {
            
               starpoints: req.body.sp
            
        })
    
    }
    

  


    if (req.body.day === "mon") {
        console.log(req.body.day);
        student


        await Student.updateOne({ _id: req.body.id }, {
            hwtime: {
                mon: req.body.time,
                tues: student.hwtime.tues,
                wed: student.hwtime.wed,
                thur: student.hwtime.thur,
                fri: student.hwtime.fri,
                sat: student.hwtime.sat,
                sun: student.hwtime.sun,




            },
        })
    }
    if (req.body.day === "tues") {
        await Student.updateOne({ _id: req.body.id }, {
            hwtime: {
                mon: student.hwtime.mon,
                tues: req.body.time,
                wed: student.hwtime.wed,
                thur: student.hwtime.thur,
                fri: student.hwtime.fri,
                sat: student.hwtime.sat,
                sun: student.hwtime.sun,




            },
        })
    }
    if (req.body.day === "wed") {
        await Student.updateOne({ _id: req.body.id }, {
            hwtime: {
                mon: student.hwtime.mon,
                tues: student.hwtime.tues,
                wed: req.body.time,
                thur: student.hwtime.thur,
                fri: student.hwtime.fri,
                sat: student.hwtime.sat,
                sun: student.hwtime.sun,




            },
        })
    }
    if (req.body.day === "thur") {
        await Student.updateOne({ _id: req.body.id }, {
            hwtime: {
                mon: student.hwtime.mon,
                tues: student.hwtime.tues,
                wed: student.hwtime.wed,
                thur: req.body.time,
                fri: student.hwtime.fri,
                sat: student.hwtime.sat,
                sun: student.hwtime.sun,




            },
        })
    }
    if (req.body.day === "fri") {
        await Student.updateOne({ _id: req.body.id }, {
            hwtime: {
                mon: student.hwtime.mon,
                tues: student.hwtime.tues,
                wed: student.hwtime.wed,
                thur: student.hwtime.thur,
                fri: req.body.time,
                sat: student.hwtime.sat,
                sun: student.hwtime.sun,




            },
        })
    }
    if (req.body.day === "sat") {
        await Student.updateOne({ _id: req.body.id }, {
            hwtime: {
                mon: student.hwtime.mon,
                tues: student.hwtime.tues,
                wed: student.hwtime.wed,
                thur: student.hwtime.thur,
                fri: student.hwtime.fri,
                sat: req.body.time,
                sun: student.hwtime.sun,




            },
        })
    }
    if (req.body.day === "sun") {
        await Student.updateOne({ _id: req.body.id }, {
            hwtime: {
                mon: student.hwtime.mon,
                tues: student.hwtime.tues,
                wed: student.hwtime.wed,
                thur: student.hwtime.thur,
                fri: student.hwtime.fri,
                sat: student.hwtime.sat,
                sun: req.body.time




            },
        })
    }
   
}


exports.syncedchecking = async (req, res) => {
    console.log(req.body);
    let student = await Student.findOne({ _id: req.body.student });
    let update; 
    if(parseInt(student.daysPracticed)>parseInt(req.body.daysPracticed)){
        update = parseInt(student.totalDaysPracticed) - 1;
    }
    else{
    update = parseInt(student.totalDaysPracticed) + 1;
    }
    let extra;
    if(req.body.pass){
        extra= await levelcalc(req.body.student, req.body.starpointsGoal, req.body.sp, req.body.level, req.body.npass);
        await Student.updateOne({ _id: req.body.student }, {
            
            starpoints: extra
         
     })
    }
    else{
        await Student.updateOne({ _id: req.body.student }, {
            
            starpoints: req.body.sp
    
            },
        );
    }
    await Student.updateOne({ _id: req.body.student }, {
        daysPracticed: req.body.daysPracticed,
        checked: req.body.checkedd,
        daystreak: req.body.daystreak,
        totalDaysPracticed: update,

        },
    );
    
    if (req.body.day === "M") {
        await Student.updateOne({ _id: req.body.student }, {
            syncedCheckboxes: {
                mon: req.body.checked,
                tues: student.syncedCheckboxes.tues,
                wed: student.syncedCheckboxes.wed,
                thur: student.syncedCheckboxes.thur,
                fri: student.syncedCheckboxes.fri,
                sat: student.syncedCheckboxes.sat,
                sun: student.syncedCheckboxes.sun,



               
            },
        })
    }
    if (req.body.day === "T") {
        await Student.updateOne({ _id: req.body.student }, {
            syncedCheckboxes: {
                mon: student.syncedCheckboxes.mon,
                tues: req.body.checked,
                wed: student.syncedCheckboxes.wed,
                thur: student.syncedCheckboxes.thur,
                fri: student.syncedCheckboxes.fri,
                sat: student.syncedCheckboxes.sat,
                sun: student.syncedCheckboxes.sun,




            },
        })
    }
    if (req.body.day === "W") {
        await Student.updateOne({ _id: req.body.student }, {
            syncedCheckboxes: {
                mon: student.syncedCheckboxes.mon,
                tues: student.syncedCheckboxes.tues,
                wed: req.body.checked,
                thur: student.syncedCheckboxes.thur,
                fri: student.syncedCheckboxes.fri,
                sat: student.syncedCheckboxes.sat,
                sun: student.syncedCheckboxes.sun,




            },
        })
    }
    if (req.body.day === "R") {
        await Student.updateOne({ _id: req.body.student }, {
            syncedCheckboxes: {
                mon: student.syncedCheckboxes.mon,
                tues: student.syncedCheckboxes.tues,
                wed: student.syncedCheckboxes.wed,
                thur: req.body.checked,
                fri: student.syncedCheckboxes.fri,
                sat: student.syncedCheckboxes.sat,
                sun: student.syncedCheckboxes.sun,




            },
        })
    }
    if (req.body.day === "F") {
        await Student.updateOne({ _id: req.body.student }, {
            syncedCheckboxes: {
                mon: student.syncedCheckboxes.mon,
                tues: student.syncedCheckboxes.tues,
                wed: student.syncedCheckboxes.wed,
                thur: student.syncedCheckboxes.thur,
                fri: req.body.checked,
                sat: student.syncedCheckboxes.sat,
                sun: student.syncedCheckboxes.sun,




            },
        })
    }
    if (req.body.day === "S") {
        await Student.updateOne({ _id: req.body.student }, {
            syncedCheckboxes: {
                mon: student.syncedCheckboxes.mon,
                tues: student.syncedCheckboxes.tues,
                wed: student.syncedCheckboxes.wed,
                thur: student.syncedCheckboxes.thur,
                fri: student.syncedCheckboxes.fri,
                sat: req.body.checked,
                sun: student.syncedCheckboxes.sun,




            },
        })
    }
    if (req.body.day === "s") {
        await Student.updateOne({ _id: req.body.student }, {
            syncedCheckboxes: {
                mon: student.syncedCheckboxes.mon,
                tues: student.syncedCheckboxes.tues,
                wed: student.syncedCheckboxes.wed,
                thur: student.syncedCheckboxes.thur,
                fri: student.syncedCheckboxes.fri,
                sat: student.syncedCheckboxes.sat,
                sun: req.body.checked




            },
        })
    }
    //res.send(extra);

    
}

exports.hwsyncedchecking = async (req, res) => {
    console.log(req.body);


    await Student.updateOne({ 'homeworks._id': req.body.homework }, {
        '$set': {
            'homeworks.$.hwchecked': req.body.checkedd,
        }


    }
    );
    
    if (req.body.day === "M") {
        console.log(req.body.checked);

        await Student.updateOne({ 'homeworks._id': req.body.homework }, {
            '$set': {
                'homeworks.$.syncedCheckboxes': {
                    mon: req.body.checked,
                    tues: req.body.syncedhw.tues,
                    wed: req.body.syncedhw.wed,
                    thur: req.body.syncedhw.thur,
                    fri: req.body.syncedhw.fri,
                    sat: req.body.syncedhw.sat,
                    sun: req.body.syncedhw.sun,




                },
            }
        })
    }
    if (req.body.day === "T") {
        await Student.updateOne({ 'homeworks._id': req.body.homework }, {
            '$set': {
                'homeworks.$.syncedCheckboxes': {
                    mon: req.body.syncedhw.mon,
                    tues: req.body.checked,
                    wed: req.body.syncedhw.wed,
                    thur: req.body.syncedhw.thur,
                    fri: req.body.syncedhw.fri,
                    sat: req.body.syncedhw.sat,
                    sun: req.body.syncedhw.sun,




                },
            }
        })
    }
    if (req.body.day === "W") {
        await Student.updateOne({ 'homeworks._id': req.body.homework }, {
            '$set': {
                'homeworks.$.syncedCheckboxes': {
                    mon: req.body.syncedhw.mon,
                    tues: req.body.syncedhw.tues,
                    wed: req.body.checked,
                    thur: req.body.syncedhw.thur,
                    fri: req.body.syncedhw.fri,
                    sat: req.body.syncedhw.sat,
                    sun: req.body.syncedhw.sun,




                },
            }
        })
    }
    if (req.body.day === "R") {
        await Student.updateOne({ 'homeworks._id': req.body.homework }, {
            '$set': {
                'homeworks.$.syncedCheckboxes': {
                    mon: req.body.syncedhw.mon,
                    tues: req.body.syncedhw.tues,
                    wed: req.body.syncedhw.wed,
                    thur: req.body.checked,
                    fri: req.body.syncedhw.fri,
                    sat: req.body.syncedhw.sat,
                    sun: req.body.syncedhw.sun,




                },
            }
        })
    }
    if (req.body.day === "F") {
        await Student.updateOne({ 'homeworks._id': req.body.homework }, {
            '$set': {
                'homeworks.$.syncedCheckboxes': {
                    mon: req.body.syncedhw.mon,
                    tues: req.body.syncedhw.tues,
                    wed: req.body.syncedhw.wed,
                    thur: req.body.syncedhw.thur,
                    fri: req.body.checked,
                    sat: req.body.syncedhw.sat,
                    sun: req.body.syncedhw.sun,




                },
            }
        })
    }
    if (req.body.day === "S") {
        await Student.updateOne({ 'homeworks._id': req.body.homework }, {
            '$set': {
                'homeworks.$.syncedCheckboxes': {
                    mon: req.body.syncedhw.mon,
                    tues: req.body.syncedhw.tues,
                    wed: req.body.syncedhw.wed,
                    thur: req.body.syncedhw.thur,
                    fri: req.body.syncedhw.fri,
                    sat: req.body.checked,
                    sun: req.body.syncedhw.sun,




                },
            }
        })
    }
    if (req.body.day === "S") {
        await Student.updateOne({ 'homeworks._id': req.body.homework }, {
            '$set': {
                'homeworks.$.syncedCheckboxes': {
                    mon: req.body.syncedhw.mon,
                    tues: req.body.syncedhw.tues,
                    wed: req.body.syncedhw.wed,
                    thur: req.body.syncedhw.thur,
                    fri: req.body.syncedhw.fri,
                    sat: req.body.syncedhw.sat,
                    sun: req.body.checked




                },
            }
        })
    }
    

}

exports.deletegoal = async (req, res) => {
    //allows teacher to add homework for students.
    try {
        console.log(req.body);

        
        if (req.body.main) {
            await Student.updateOne({ _id: req.body.id }, {

                mainGoal: {}


            }
            )
        }
        else {
            console.log(req.body);
            const student = await Student.findOne({ _id: req.body.id });
            let newGoals= [];
            for (let i = 0; i < student.goals.length; i++) {
                

                if (student.goals[i]._id.toString() !== req.body.goal._id.toString()) {
                    newGoals.push(student.goals[i]);
                }
            }
            console.log(newGoals);
            await Student.updateOne({ _id: req.body.id }, {

                
                    goals: newGoals,
                }
            
        )






        }
    }
    catch (err) {
        console.log(err);
    }
}
exports.addNotes = async (req, res) => {
    console.log(req.body);
    await Student.updateOne({ _id: req.body.id }, {
        $push: {
            notes: {
                description: req.body.description,
                date: req.body.date
            }
        }
    })
}
exports.deletefromarchive = async (req, res) => {
    console.log("body", req.body);
   
   
   
    const stud = await Student.findOne({ 'archive._id': req.body.id });
    console.log(stud);
    let a = [];
    for (let i = 0; i < stud.archive.length; i++) {
        if (stud.archive[i]._id !== req.body.id) {

            a.push(stud.archive[i])
        }
    }
    if (a.length>0) {
        console.log(a.length);

        await Student.updateOne({ 'archive._id': req.body.id }, {
            archive: a,
        })
    }
    else {
        await Student.updateOne({ 'archive._id': req.body.id }, {
            archive: [],
        })
    }
        
    

}

exports.archivegoal = async (req, res) => {
    //allows teacher to add homework for students.
    try {
        console.log(req.body);


        if (req.body.main) {
            await Student.updateOne({ _id: req.body.id }, {
                mainGoal: {},
                $push: {
                    archive: req.body.goal
                    
                }
            
                


            }
            )
            
        }
        else {
            console.log(req.body);
            const student = await Student.findOne({ _id: req.body.id });
            let newGoals = [];
            for (let i = 0; i < student.goals.length; i++) {


                if (student.goals[i]._id.toString() !== req.body.goal._id.toString()) {
                    newGoals.push(student.goals[i]);
                }
            }
            console.log(newGoals);
            await Student.updateOne({ _id: req.body.id }, {


                goals: newGoals,
                $push: {
                    archive: req.body.goal
                    }
                })
                
            }

            






        
    }
    catch (err) {
        console.log(err);
    }
}
exports.deletenote = async (req, res) => {
    console.log("body", req.body);

    const stud = await Student.findOne({ _id: req.body.student });
    let a = [];
    for (let i = 0; i < stud.notes.length; i++) {
        if (stud.notes[i]._id.toString() !== req.body.id.toString()) {
            a.push(stud.notes[i])
        }
    }
    if (a.length > 0) {

        await Student.updateOne({ 'notes._id': req.body.id }, {
            notes: a,
        })
    }
    else {
        await Student.updateOne({ 'notes._id': req.body.id }, {
            notes: [],
        })
    }
}

exports.changeNotes = async (req, res) => {
    console.log(req.body);

    const student = await Student.findOne({ _id: req.body.id });
    let a = [];

    for (let i = 0; i < student.notes.length; i++) {
        if (student.notes[i].description.toString() === req.body.note.description.toString()) {
            if (student.notes[i].date.toString() === req.body.note.date.toString()) {
                let note = {
                    _id: student.notes[i]._id,
                    description: req.body.notes.description,
                    date: req.body.notes.date,
                }
                a.push(note);
            }
            else {
                a.push(student.notes[i])

            }
        }
        else {
            a.push(student.notes[i])

        }
    }

    await Student.updateOne({ _id: req.body.id }, {
        notes: a,

    });

}
exports.timeTotal = async (req, res) => {
    console.log("timebool", req.body);
    await Student.updateOne({ _id: req.body.id }, {
        timeTotal: req.body.total,
       

    }
    )

}
exports.editAlltheHomeworkdiaClose = async (req, res) => {
    console.log(req.body);

    
    await Student.updateOne({ _id: req.body.id }, {
        syncedCheckbox: req.body.yesnoCheckboxsync,
        timeday: req.body.yesnoDay,
        checkboxes: req.body.yesnocheckboxes,
        edityesnoWeek: req.body.edityesnoWeek,
        time: req.body.edityesnoWeek,
        dayStreak: req.body.yesnoStreak,
        min: req.body.yesnoWeektext,
        dmin: req.body.yesnoDaytext,

        

    })

    if(!req.body.yesnoCheckboxsync){
        if(req.body.yesnocheckboxes==="0"){
            await Student.updateOne({ _id: req.body.id }, {
                totalDays: ""
               
        
                
        
            })
        
        }

    }
    if(!req.body.edityesnoWeek){
        if(!req.body.yesnoDay){
            await Student.updateOne({ _id: req.body.id }, {
                wmin: ""
               
        
                
        
            })
        
        }

    }
}
  
exports.timeSync = async (req, res) => {
    console.log("timecheck", req.body);
    if (req.body.timeSync) {
        await Student.updateOne({ _id: req.body.id }, {
            time: true,
            timeday: true,
            hwtime: {
                mon: "0",
                tues: "0",
                wed: "0",
                thur: "0",
                fri: "0",
                sat: "0",
                sun: "0",
            },
            min: req.body.min,
            daybiao: req.body.daybiao,
            dmin: req.body.dmin

        }
        )
    }
    else {
        await Student.updateOne({ _id: req.body.id }, {
            time: true,
            timeday: false,

            totalWeekTime: {
                total: "0",
            },
            min: req.body.min,
            daybiao: req.body.daybiao,
            dmin: req.body.dmin

        }
        )
    }
}
exports.syncCheckboxes = async (req, res) => {
    console.log("synccheck", req.body);
    await Student.updateOne({ _id: req.body.id }, {
        syncedCheckbox: true,
        checkboxes: req.body.checkbox,
        syncedCheckboxes: {
            mon: false,
            tues: false,
            wed: false,
            thur: false,
            fri: false,
            sat: false,
            sun: false,
        },
    }
    )
}

exports.changenote = async (req, res) => {
    console.log(req.body);

    const student = await Student.findOne({ _id: req.body.id });
    let a = [];

    for (let i = 0; i < student.notes.length; i++) {
        if (student.notes[i]._id.toString() === req.body.note._id.toString()) {
            
              
                
                a.push(req.body.note);
            }
           
        
        else {
            a.push(student.notes[i])

        }
    }

    await Student.updateOne({ _id: req.body.id }, {
        notes: a,

    });

}

exports.deleteNotes = async (req, res) => {
    console.log(req.body);

    const student = await Student.findOne({ _id: req.body.id });
    let a = [];

    for (let i = 0; i < student.notes.length; i++) {
        if (student.notes[i].description.toString() === req.body.notes.description.toString()) {
            if (student.notes[i].date.toString() === req.body.notes.date.toString()) {

                
            }
            else {
                a.push(student.notes[i])

            }
        }
        else {
            a.push(student.notes[i])

        }
    }

    await Student.updateOne({ _id: req.body.id }, {
        notes: a,

    });

}
exports.deleteHomework = async (req, res) => {
    //allows teacher to add homework for students.
    try {
        console.log(req.body);

            const student = await Student.findOne({ _id: req.body.id });
            let newhomework = [];
        for (let i = 0; i < student.homeworks.length; i++) {
                

            if (student.homeworks[i]._id.toString() !== req.body.homework._id.toString()) {
                newhomework.push(student.homeworks[i]);
                }
            }
        console.log(newhomework);
            await Student.updateOne({ _id: req.body.id }, {


                homeworks: newhomework,
            }

            )






       
    }
    catch (err) {
        console.log(err);
    }
}
exports.savegoal = async (req, res) => {
    //allows teacher to add homework for students.
    
    try {
        console.log(req.body);
        /*
        console.log(req.body);
        if (req.body.mainGoal) {
            await Student.updateOne({ _id: req.body.id }, {

                mainGoal: {
                    title: req.body.goal,
                    description: req.body.description,
                    date: req.body.date,
                    complete: false,


                }


            }
            )
        }
        else {
            console.log(req.body);

            await Student.updateOne({ _id: req.body.id }, {

                $push: {
                    goals: {
                        title: req.body.goal,
                        description: req.body.description,
                        daily: req.body.day,
                        complete: false,

                    }
                }
            })






        }*/
    }
    catch (err) {
        console.log(err);
    }
}
exports.goalStatusChange = async (req, res) => {
    try {
        console.log(req.body);
        if (req.body.main) {
            if (req.body.checked) {


                await Student.updateOne({ _id: req.body.id }, {
                    mainGoal: {
                        title: req.body.goal.title,
                        description: req.body.goal.description,
                        date: req.body.date,
                        complete: true,
                        completed: req.body.complete
                    }


                } 
               
                )
                if(req.body.pass){
                    extra= await levelcalc(req.body.id, req.body.starpointsGoal, req.body.sp, req.body.level, req.body.npass);
                    await Student.updateOne({ _id: req.body.id }, {
                        
                        starpoints: extra
                     
                 })
                }
                else{
                    await Student.updateOne({ _id: req.body.id }, {
                        
                           starpoints: req.body.sp
                        
                    })
                
                }
                
            }



            else {

                await Student.updateOne({ _id: req.body.id }, {
                    mainGoal: {
                        title: req.body.goal.title,
                        description: req.body.goal.description,
                        date: req.body.date,
                        complete: false,
                        completed: "",

                    }


                }
                )
                if(req.body.pass){
                    extra= await levelcalc(req.body.id, req.body.starpointsGoal, req.body.sp, req.body.level, req.body.npass);
                    await Student.updateOne({ _id: req.body.id }, {
                        
                        starpoints: extra
                     
                 })
                }
                else{
                    
                    await Student.updateOne({ _id: req.body.id }, {
                        
                           starpoints: req.body.sp
                        
                    })
                
                }



            }
        }
        else {
            if (req.body.checked) {


                await Student.updateOne({ 'goals._id': req.body.goal._id }, {
                    '$set': {
                        'goals.$.complete': true,
                        'goals.$.completed': req.body.complete,

                    }


                }
                )
                if(req.body.pass){
                    extra= await levelcalc(req.body.id, req.body.starpointsGoal, req.body.sp, req.body.level, req.body.npass);
                    await Student.updateOne({ _id: req.body.id }, {
                        
                        starpoints: extra
                     
                 })
                }
                else{
                    
                    await Student.updateOne({ _id: req.body.id }, {
                        
                           starpoints: req.body.sp
                        
                    })
                
                }
            }



            else {

                await Student.updateOne({ 'goals._id': req.body.goal._id }, {
                    '$set': {
                        'goals.$.complete': false,
                        'goals.$.completed': "",

                    }


                }
                )
                if(req.body.pass){
                    extra= await levelcalc(req.body.id, req.body.starpointsGoal, req.body.sp, req.body.level, req.body.npass);
                    await Student.updateOne({ _id: req.body.id }, {
                        
                        starpoints: extra
                     
                 })
                }
                else{
                    
                    await Student.updateOne({ _id: req.body.id }, {
                        
                           starpoints: req.body.sp
                        
                    })
                
                }



            }
        }

 
}
    catch (err) {
        console.log(err);
    }
}

exports.pastFirstTime = async (req, res) => {
    //This allows the student when they log in for the first time to change their password.
    //I need to add an edge case here where the student has that same email as the teacher.
    //I also need to make sure that if a student ever has two different teachers that use the app that their account can be duo for the teacher but not the other way arround.
    try {
        console.log(req.body);
        var cryptpass = await argon2.hash(req.body.password);
        await Account.updateOne({ _id: req.body.id }, {
            password: cryptpass,
            pastFirstTime: true,
            
        });
        for (i = 0; i < req.body.studentid.length; i++) {
            console.log(req.body.studentid[i]);
            await Student.updateOne({ _id: req.body.studentid[i] }, {
                password: cryptpass,

            });
        }
    }
    catch (err) {
        console.log(err);
    }
}


levelcalc = async (id, starpointsGoal, sp, level, npass ) =>{
    try{

        if(!npass){

        var newgoal = parseInt(starpointsGoal) *2;
        var extra =  (parseInt(sp) -  parseInt(starpointsGoal)).toString();
       // console.log("is this nan?", newgoal, extra);

        
       
       if(parseInt(newgoal<100)){
        newgoal= "100"
        level++;
    }
        
        
        if (parseInt(extra) >= newgoal){
            extra =  (parseInt(extra) -  parseInt(newgoal)).toString();
            newgoal = newgoal *2;
            if(parseInt(newgoal<100)){
                newgoal= "100"
                level++;
            }
            //console.log(newgoal, extra);

            
            await Student.updateOne({ _id: id }, {
                level: (parseInt(level) + 2).toString(),
                starpointsGoal: newgoal.toString(),
    
            });
        }
        else{
            if(parseInt(newgoal<100)){
                newgoal= "100"
                level++;
            }
            await Student.updateOne({ _id: id }, {
                level: (parseInt(level) + 1).toString(),
                starpointsGoal: newgoal.toString(),
    
            });
        }
        if(parseInt(extra)===parseInt(newgoal)){
            extra= "0"
        }
        if(extra<0){
            extra=0;
        }

        return extra
    }
    else{
        if(parseInt(starpointsGoal)!==100){
        console.log(sp)
        var newgoal = parseInt(starpointsGoal) /2;
        var extra =   parseInt(sp) + newgoal ;
        if(parseInt(newgoal<100)){
            newgoal= "100"
            level++;
        }
        console.log(extra, newgoal);


        
       
        
        
        
        if (parseInt(extra) < 0){
            
            newgoal = newgoal /2;
            extra =   parseInt(extra) + newgoal ;
            console.log(extra, newgoal);
            if(parseInt(newgoal<100)){
                newgoal= "100"
                level++;
            }
            console.log(extra, newgoal);
            await Student.updateOne({ _id: id }, {
                level: (parseInt(level) - 2).toString(),
                starpointsGoal: newgoal.toString(),
    
            });
        }
        else{
            if(parseInt(newgoal<100)){
                newgoal= "100"
                level++;
            }
            await Student.updateOne({ _id: id }, {
                level: (parseInt(level) - 1).toString(),
                starpointsGoal: newgoal.toString(),
    
            });
        }
        if(parseInt(extra)===parseInt(newgoal)){
            extra= "0"
        }
        if(extra<0){
            extra=0;
        }
    

        return extra
    }
    else{
        await Student.updateOne({ _id: id }, {
            level: "0",
            starpointsGoal: "100",
            

        });
        return "0"
    }
    }

    }
    catch(err){
        console.log(err)
    }
}
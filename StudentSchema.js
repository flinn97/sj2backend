const mongoose = require('mongoose');
//structure fro student.
const Student = mongoose.model(
        "Student",
    new mongoose.Schema({
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        lesson: String,
        teacherID: String,
        userID: String,
        mstarpoints: Boolean,
        password: String,
        role: String,
        homework: String,
        pastFirstTime: Boolean,
        doubleAccount: Boolean,
        checkboxes: String,
        scheduling: String,
        day: String,
        profilepic: String,
        backgroundpic: String,
        about: String,
        checked: String,
        sep: Boolean,
        totalDaysPracticed: String,
        finalTotalTime: String,
        totalDays: String,
        totalGoals: String,
        active: Boolean,
        newlyadded: Boolean,
        timeTotal: String,
        totaltime: String,
        syncedCheckbox: Boolean,
        time: Boolean,
        timeday: Boolean,
        daysPracticed: String,
        dayTotal: String,
        daysbool: Boolean,
        monthStart: String,
        monthEnd: String,
        tsmonths: String,
        temonths: String,
        timebool: Boolean,
        wMonthStart: String,
        wMonthEnd: String,
        min: String,
        starPoints: Boolean,
        starpoints: String,
        starpointsGoal: String,
        daybiao: Boolean,
        timebiao: Boolean,
        dmin: String,
        wmin: String,
        level: String,
        dayStreak: Boolean,
        daystreak: String,
        weekStreak: String,
        
        edityesnoWeek: Boolean,
        hwtime: {
            mon: String,
            tues: String,
            wed: String,
            thur: String,
            fri: String,
            sat: String,
            sun: String,
        },
        totalWeekTime: {
            total: String,
        },
        
        syncedCheckboxes: {
            mon: Boolean,
            tues: Boolean,
            wed: Boolean,
            thur: Boolean,
            fri: Boolean,
            sat: Boolean,
            sun: Boolean,
        },
            homeworks: [
                {
                    title: String,
                    description: String,
                    hwchecked: {
                        mon: Boolean,
                        tues: Boolean,
                        wed: Boolean,
                        thur: Boolean,
                        fri: Boolean,
                        sat: Boolean,
                        sun: Boolean,
                    },
                    hwtype: String,
                    hwcheckboxes: String,
                    date: String,
                    research: String,
                    daily: String,
                    hwsynccheck: Boolean,
                    hwtime: Boolean,
                    hwlink: String,
                    hwdmin: String,
                    HWweeklytimebiao: String,
                    hwtimesync: Boolean,
                    hwstruggles: Boolean,
                    hwQuestions: Boolean,
                    firstMessage: Boolean,
                    yesnoday: Boolean,
                    yesnoweek: Boolean,
                    messages: [{
                        m: String,
                        date: String,
                        role: String,
                    }],
                    
                    hwtime: {
                        mon: String,
                        tues: String,
                        wed: String,
                        thur: String,
                        fri: String,
                        sat: String,
                        sun: String,
                    },
                    totalWeekTime: {
                        total: String,
                    },


                },
            ],

            mainGoals: [{mainGoal: {
                id: String,
                title: String,
                description: String,
                date: String,
                complete: Boolean,
                completed: String,
                goals: [
                    {
                        title: String,
                        description: String,
                        date: String,
                        complete: Boolean,
                        completed: String,
    
    
                    },
                ],
                


            }
            }],




            mainGoal: {
                title: String,
                description: String,
                date: String,
                complete: Boolean,
                completed: String,
                


            },
            goals: [
                {
                    title: String,
                    description: String,
                    date: String,
                    complete: Boolean,
                    completed: String


                },
            ],
            archive: [
                {}
            ],

            notes: [
                {
                    description: String,
                    date: String,
                    tempID: String,
                }
            ]
    
        })
);

module.exports = Student; 

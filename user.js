const controller = require("./controller");
const admin = require("./admin");

const addStudent = require("./student");
const addPhoto = require("./multers");
const User = require("./users");
const Student = require("./StudentSchema.js");
//const Photo = require("./PictureSchema.js");
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const aws = require('aws-sdk');
const fs = require('fs');
const path = require('path');

//controller portion
module.exports = function (app) {

	app.use(function (req, res, next) {
		res.header(
			"Access-Control-Allow-Headers",
			"x-access-token, Origin, Content-Type, Accept"
		);
		next();
	});
	//various app posts for various functionality. 
	app.post(

		"/api/auth/signup",
		controller.signup

	);
	app.post("/api/auth/changeuserinfo", controller.changeuserinfo);
	app.post("/api/auth/changeStudentinfo", addStudent.changeStudentinfo);
	app.post("/api/auth/deleteStudent", controller.deleteStudent);

	app.post("/api/auth/signin", controller.signin);
	app.post("/api/auth/getAccount", controller.getAccount);
	app.post("/api/auth/goalStatusChange", addStudent.goalStatusChange);


	app.post("/api/auth/student", addStudent.addstudent);
	app.post("/api/auth/goals", addStudent.addgoal);
	app.post("/api/auth/clearChecks", addStudent.clearChecks);
	app.post("/api/auth/getAccounts", controller.getAccounts);

	app.post("/api/auth/getStudents", addStudent.getthem);
	app.post("/api/auth/homework", addStudent.addHomwork);
	app.post("/api/auth/past", addStudent.pastFirstTime);
	app.post("/api/auth/postpic", addPhoto.postpic);
	app.delete("/api/auth/logout", controller.logout);
	app.post("/api/auth/getuser", controller.getUser);
	app.post("/api/auth/getstudent", addStudent.getstudent);
	app.post("/api/auth/checked", addStudent.checked);
	app.post("/api/auth/deletegoal", addStudent.deletegoal);
	app.post("/api/auth/savegoal", addStudent.savegoal);
	app.post("/api/auth/deleteHomework", addStudent.deleteHomework);
	app.post("/api/auth/archivegoal", addStudent.archivegoal);
	app.post("/api/auth/daysPracticed", addStudent.daysPracticed);
	app.post("/api/auth/totalDays", addStudent.totalDays);
	app.post("/api/auth/changeactivestudent", addStudent.changeactivestudent);
	app.post("/api/auth/hwchecked", addStudent.hwchecked);
	app.post("/api/auth/doneUpdatingnewStudent", addStudent.doneUpdatingnewStudent);
	app.post("/api/auth/getAllstudents", addStudent.getAllstudents);
	app.post("/api/auth/getAllaccounts", controller.getAllaccounts);
	app.post("/api/auth/deletefromarchive", addStudent.deletefromarchive);
	app.post("/api/auth/addNote", addStudent.addNotes);
	app.post("/api/auth/deletenote", addStudent.deletenote);
	app.post("/api/auth/deleteNotes", addStudent.deleteNotes);
	app.post("/api/auth/changeNotes", addStudent.changeNotes);
	app.post("/api/auth/changenote", addStudent.changenote);

	app.post("/api/auth/checkboxes", addStudent.checkbox);
	app.post("/api/auth/AddHomeworks", addStudent.AddHomeworks);
	app.post("/api/auth/AddGoals", addStudent.AddGoals);
	app.post("/api/auth/syncCheckboxes", addStudent.syncCheckboxes);
	app.post("/api/auth/timeSync", addStudent.timeSync);
	app.post("/api/auth/timeTotal", addStudent.timeTotal);
	app.post("/api/auth/dayTotal", addStudent.dayTotal);
	app.post("/api/auth/setDayStreak", addStudent.setDayStreak);
	app.post("/api/auth/setWeekStreak", addStudent.setWeekStreak);

	app.post("/api/auth/starPoints", addStudent.starPoints);
	app.post("/api/auth/changetimes", addStudent.changetimes);
	app.post("/api/auth/changeweek", addStudent.changeweek);

	app.post("/api/auth/clearTime", addStudent.clearTime);
	app.post("/api/auth/editAlltheHomeworkdiaClose", addStudent.editAlltheHomeworkdiaClose);


	app.post("/api/auth/getAllusers", controller.getAllusers);

	app.post("/api/auth/cleargoals", admin.cleargoals);
	app.post("/api/auth/clearhw", admin.clearhw);
	app.post("/api/auth/cleararchive", admin.cleararchive);
	app.post("/api/auth/changeAccountInfo", admin.changeAccountInfo);
	app.post("/api/auth/changeuserinfoA", admin.changeuserinfoA);
	app.post("/api/auth/changeStudentinfoA", admin.changeStudentinfoA);
	app.post("/api/auth/admindelete", admin.admindelete);
	app.post("/api/auth/syncedchecking", addStudent.syncedchecking);
	app.post("/api/auth/editalltheProgress", addStudent.editalltheProgress);
	app.post("/api/auth/doitAll", addStudent.doitAll);
	app.post("/api/auth/hwmessage", addStudent.hwmessage);
	app.post("/api/auth/hwsyncedchecking", addStudent.hwsyncedchecking);
	app.post("/api/auth/hwchangeweek", addStudent.hwchangeweek);
	app.post("/api/auth/hwchangetimes", addStudent.hwchangetimes);
	app.post("/api/auth/clearhwChecks", addStudent.clearhwChecks);
	app.post("/api/auth/clearhwTime", addStudent.clearhwTime);
	app.post("/api/auth/photoprac", admin.photoprac);






	//putting this in a different file later.
	const multer = require('multer');

	const upload = multer({
		
		dest: "./public", //'/var/www/www.flinnapps.com/html/images',
		limits: {
			fieldSize: 8 * 1024 * 1024
		}
	});
	// Upload a photo. Uses the multer middleware for the upload and then returns
	// the path where the photo is stored in the file system.
	app.post('/api/auth/postpic', upload.single('photo'), async (req, res) => {
		// Just a safety check
		try {
			if (!req.file) {
				return res.sendStatus(400);
			}
			console.log("file", req.file);
			console.log("filename", req.file.filename);

			aws.config.setPromisesDependency();
			aws.config.update({
				accessKeyId: "",
				secretAccessKey: "",
			});
			const s3 = new aws.S3();
			var params = {
				Bucket: "legatomusicphoto190010-dev",
				Body: fs.createReadStream(req.file.path),
				Key: `imgs/${req.file.originalname}`
			};

			await s3.upload(params, (err, data) => {
				if (err) {
					console.log('Error occured while trying to upload to S3 bucket', err);
				}

				if (data) {
					console.log("uploaded", data,);

					
					fs.unlinkSync(req.file.path); // Empty temp folder
					const locationUrl = data.key;
					console.log(locationUrl);
					var params1 = {
						Bucket: "legatomusicphoto190010-dev",
						Key: `imgs/${req.file.originalname}`,
						Expires: 604800
					};
					res.send({
						path: "https://ik.imagekit.io/gtsewnrjnnh/" + req.file.originalname
					})
				//	var promise = s3.getSignedUrlPromise('getObject', params1);
				//	promise.then(function (url) {
				//		console.log(url);
				//		res.send({
				//			path: url
				//		})
				//	}, function (err) { console.log(err) });

				
				}
			});

		}
			
		
		catch (e) {
			console.log(e);
        }
	});


	app.post('/api/auth/profilepic', async (req, res) => {
		console.log("req.body", req.body);
		if (req.body.role === "student") {
			console.log("igot here");
			if (req.body.background) {

				await Student.updateOne({ _id: req.body.id }, {
					backgroundpic: req.body.picpath,
				}).then(result => {
					res.status(201).json({
						message: "User background registered successfully!",

					})
				}).catch(err => {
					console.log(err),
						res.status(500).json({
							error: err
						});
				})
			}
			else {
				console.log(req.body.id);
				const SaveUser = await Student.findOne({
					_id: req.body.id
				});

				await Student.updateOne({ _id: req.body.id }, {
					profilepic: req.body.picpath,
				}).then(result => {
					console.log(SaveUser);
					res.status(201).json({
						message: "User profile registered successfully!",

					})
				}).catch(err => {
					console.log(err),
						res.status(500).json({
							error: err
						});
				})
			}
		}
		else {
			if (req.body.background) {

				await User.updateOne({ _id: req.body.id }, {
					backgroundpic: req.body.picpath,
				}).then(result => {
					res.status(201).json({
						message: "User background registered successfully!",

					})
				}).catch(err => {
					console.log(err),
						res.status(500).json({
							error: err
						});
				})
			}
			else {
				console.log(req.body);
				const SaveUser = await User.findOne({
					_id: req.body.id
				});

				await User.updateOne({ _id: req.body.id }, {
					profilepic: req.body.picpath,
				}).then(result => {
					console.log(SaveUser);
					res.status(201).json({
						message: "User profile registered successfully!",

					})
				}).catch(err => {
					console.log(err),
						res.status(500).json({
							error: err
						});
				})
			}
		}
	});
	/*
	const storage = multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, "./public/");
		},
		filename: (req, file, cb) => {
			const fileName = file.originalname.toLowerCase().split(' ').join('-');

			cb(null, uuidv4() + '-' + fileName)

		}
	});

	var upload = multer({
		
		storage: storage,
		fileFilter: (req, file, cb) => {
			if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
				cb(null, true);
			} else {
				cb(null, false);
				return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
			}
		}
	});

	app.post("/api/auth/postpic", upload.single('profileImg'), async (req, res, next) => {
		
		const url = req.protocol + '://' + req.get('host')


		const photo = new Photo({
			_id: new mongoose.Types.ObjectId(),
			name: req.body.name,

			profileImg: url + '/public/' + req.file.filename
		});
		await photo.save().then(result => {
			res.status(201).json({
				message: "User registered successfully!",
				userCreated: {
					_id: result._id,
					profileImg: result.profileImg
				}
			})
		}).catch(err => {
			console.log(err),
				res.status(500).json({
					error: err
				});
		})
	})

	app.post("/api/auth/profilepic", async (req, res, next) => {
		console.log(req.body);

		const pic = await Photo.findOne({
			_id: req.body.picid
		});

		await User.updateOne({ _id: req.body.id }, {
			profilepic: pic,
		}).then(result => {
			res.status(201).json({
				message: "User registered successfully!",
				
			})
		}).catch(err => {
			console.log(err),
				res.status(500).json({
					error: err
				});
		})


})*/
};

const express = require('express');
const User = require("./users");

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');




const multer = require('multer')
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

exports.postpic = upload.single('profileImg'), async (req, res, next) => {
	console.log(req.body);
	const url = req.protocol + '://' + req.get('host')


	const Photo = {
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		profileImg: url + '/public/' + req.file.filename
	};

	await User.updateOne({ _id: req.body.id }, {
		profilepic: Photo,
	}).then(result => {
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
}

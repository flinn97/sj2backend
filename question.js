const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
var cors = require('cors');
const app = express();
app.use('/public/', express.static(__dirname + '/public/'));
//use cors, mongoose and connect to controller
var corsOptions = {
	origin: "http://localhost:8081"
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


//jump to the controller user.js
require("./user.js")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('Server listening on port 8080!'));

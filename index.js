let express = require('express');
let cors = require('cors');

let app = express();

app.use(cors());

//This is how to make get requests in express
//This example will trigger when you visit the / endpoint of the webapp
app.get('/', (req, res) => {
	res.status(200).send('Hello World!'); //You can send strings back from the API call
});

//Javascript has two notations for functions: arrow notation (above) and anonymous function notation (below)
//This example will trigger when you visit the /test endpoint
app.get('/test', function(req, res) {
	res.status(200).send({example: "Testing"}); //You can also send objects back from the API call as JSON
});


//You can also receive parameters from the GET requests by telling express with a : character
app.get('/echo/:stringToEcho', (req, res) => {
	res.status(200).send({echo: req.params.stringToEcho}); //You can access the parameters in the req.params.parameterName THEY MUST MATCH THE ENDPOINT NAME
});

//You can have multiple parameters
app.get('/echo/:stringToEcho/:count', (req, res) => {
	let ans = {};
	for (let i = 0; i < req.params.count; i++) {
		ans["echo" + (i + 1)] = req.params.stringToEcho;
	}
	res.status(200).send(ans);
});

//You use http status codes to send error messages that are quick to check, google the common status codes, you probably know 404 as does not exists
app.get('/dne', (req, res) => {
	res.status(404).send({error: "example for does not exist"});
});


app.listen(8000); //This is the port express will listen on
	

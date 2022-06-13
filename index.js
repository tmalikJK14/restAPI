//REQUIRED MODULES
const Joi = require('joi'); //this module returns a class
const express = require('express');

const app = express();
//express.json() will give middleware which will be used in (req, res) pipepline of app.use() 
app.use(express.json());
//ARRAY FOR DATABASE
//we are not using any database right now so here we have provided hard coded data
const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'},
];


//READ
//Route for reading data at '/' directory
app.get('/', (req, res) => {
    res.send('This is the root directory!!!');
});


//READ
//route for reading courses data at '/api/courses' directory 
app.get('/api/courses', (req, res) => {
    res.send(courses);
});


//READ
//route for reading specific course data at '/api/courses/:id' directory
app.get('/api/courses/:id', (req, res) => {
    //courses.find() will return the id asked by the user
    //c is the arguement of find()
    //c defines as the course which matches the given criteria
    //req.params.id will return id in string format so we convert or parse it into int using ParseInt
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) {
        //if course id is not matched then display below message
        return res.status(404).send('The course with given id was not found');
    }
    res.send(course);
});


//INSERT
//route for inserting new information into the database
app.post('/api/courses', (req, res) => {
    // //scheme defines shape of our object, what properties does our object have?
    // // do we have email, string, max number of characters etc
    // const schema = Joi.object({
    //     name: Joi.string().min(3).max(30).required(),
    // }); 
    // //after validating the object is now stored into variable result
    // const result = schema.validate(req.body);

    // //logic for inputing data so that user dont enter empty data
    // //SIMPLE LOGIC
    // // if(!req.body.name || req.body.name.length < 3) {
    // //     //400 BAD REQUEST
    // //     res.status(400).send("Name is required and minimum length should be 3");
    // //     return;
    // // }
    
    // //SIMPE LOGIC BUT MORE EFFICIENT
    // if(result.error) {
    //     // res.status(400).send(result.error)  -> this gives an joi error with full description which 
    //     //   will confuses the client. So we have used .details[0].message 
    //     res.status(400).send(result.error.details[0].message);
    //     return;
    // }
    
    //MORE EFFICIENT LOGIC
    // const result = validateCourse(req.body); //object destructering method
    const { error } = validateCourse(req.body); // this is simply means result.error
    // if(result.error) {
    if(error) {
        // res.status(400).send(result.error)  -> this gives an joi error with full description which 
        //   will confuses the client. So we have used .details[0].message 
        return res.status(400).send(error.details[0].message);
    }
    //here we are structuring our input data body
    const course = {
        //when we work with database id is auto incremented
        //here we are just assigning id +1 with respect to the last entry 
        id: courses.length + 1,
        //we need to read name from the body of request so req.body.name
        //  for req.body.name to work we need to enable parsing of JSON object in the body of request
        //   cuz by default this is not enabled in express.js
        //    thats why we have enabled app.use(express.json());  
        name: req.body.name
    };
    //pushing new course into the courses array
    courses.push(course);
    //return the course info which has been pushed into the database
    res.send(course);
});


//UPDATE
//route for updating the existing information in the database
app.put('/api/courses/:id', (req, res) => {
    //looks up for the id which user has entered to update
    const course = courses.find(c => c.id === parseInt(req.params.id));
    //if entered id course is not found then print error 
    if(!course) {
        return res.status(404).send("The course with the given ID was not found in the database");
    }
    //validating
    //SIMPLE EFFICIENT LOGIC 
    // const schema = Joi.object({
    //     name: Joi.string().min(3).max(30).required(),
    // }); 
    // const result = schema.validate(req.body);

    //MORE EFFICIENT LOGIC
    // const result = validateCourse(req.body); //object destructering method
    const { error } = validateCourse(req.body); // this is simply means result.error
    // if(result.error) {
    if(error) {
        // res.status(400).send(result.error)  -> this gives an joi error with full description which 
        //   will confuses the client. So we have used .details[0].message 
        return res.status(400).send(error.details[0].message);
    }
    course.name = req.body.name;
    res.send(course);
});

//function for validating user input
function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
    }); 
    return schema.validate(course);
}


//route for deleting the information from the database
app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) {
        return res.status(404).send("The course with the given ID was not found in the database");
    }
    //if course id is found then delete the record
    const index = courses.indexOf(course);
    courses.splice(index, 1); //this is to remove 1 object from our courses array
    res.send(course);
});

//PORT LISTENING
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening at port: ${port}...`));
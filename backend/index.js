const express = require('express');
const bodyParser = require('body-parser');
const { body, param, validationResult } = require('express-validator');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();

app.use(bodyParser.json());

// logger middleware
app.use((req,res,next)=> {
    console.log("In comes a: " + req.method + " request to: " + req.url)
    next()
})

const uri = "mongodb+srv://riazzx:Riazzx.1121@cluster0.ygr7yjf.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
 if (err) {
   console.error('Failed to connect to MongoDB Atlas', err);
   process.exit(1);
 }

console.log('Connected to MongoDB Atlas');

const db = client.db('employeesDB');
const employees = db.collection('employees');

app.get('/employees', async (req, res) => {
    try {
      // Fetch all employees from the 'employees' collection
      const result = await employees.find().toArray();
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Error retrieving employees:', error);
      res.status(500).json({ error: 'Error retrieving employees' });
    }
  });


app.post('/addEmployee', [
    body('name').isString().notEmpty(),
    body('email').isEmail(),
  ], async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { name, email,  } = req.body;
  
      // Check if an employee with the same email already exists
      const existingEmployee = await employees.findOne({ email });
      if (existingEmployee) {
        return res.status(400).json({ error: 'Employee with this email already exists' });
      }
  
      // Insert the new employee into the database
      const employee = {
        name,
        email,
        
      };
      const result = await employees.insertOne(employee);
  
      // Send a success response with the newly added employee's data
      res.status(201).json(result.ops);
    } catch (error) {
      console.error('Error adding employee:', error);
      res.status(500).json({ error: 'Error adding employee' });
    }
  });
   


app.put('/setSupervisor/:employeeId', [
    param('employeeId').isMongoId(), // Ensure the employeeId is a valid MongoDB ObjectId
    body('supervisorId').isMongoId(), // Ensure the supervisorId is a valid MongoDB ObjectId
  ], async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const employeeId = req.params.employeeId;
      const employeeObjectID = ObjectId(employeeId)
      const supervisorId = req.body.supervisorId;
      const supervisorObjectID = ObjectId(supervisorId)

      if (employeeId === supervisorId) {
        return res.status(400).json({ error: "An employee cannot supervise themselves" });
      }

      // Check if the employee with the given ID exists
      const existingEmployee = await employees.findOne({ _id: employeeObjectID });
  
      if (!existingEmployee) {
        return res.status(404).json({ error: 'Employee not found' });
      }
  
      // Check if the supervisor with the given ID exists
      const existingSupervisor = await employees.findOne({ _id: supervisorObjectID });
  
      if (!existingSupervisor) {
        return res.status(404).json({ error: 'Supervisor not found' });
      }

       // Check if the employee already has a supervisor
    if (existingEmployee.supervisor) {
        return res.status(400).json({ error: 'An employee can have only one supervisor' });
      }

       // Ensure the employee is not currently supervising the chosen supervisor
       if (existingEmployee._id.equals(existingSupervisor.supervisor)) {
        return res.status(400).json({ error: 'An employee cannot supervise someone who supervises them' });
      }
  
      // Update the employee's supervisor
      const result = await employees.updateOne(
        { _id: employeeObjectID },
        { $set: { supervisor: supervisorObjectID } }
      );
  
      if (result.modifiedCount === 1) {
        res.status(200).json({ message: 'Supervisor updated successfully' });
      } else {
        res.status(500).json({ error: 'Failed to update supervisor' });
      }
    } catch (error) {
      console.error('Error setting supervisor:', error);
      res.status(500).json({ error: 'Error setting supervisor' });
    }
});


app.delete('/deleteEmployee/:employeeId', [
    param('employeeId').isMongoId(), // Ensure the employeeId is a valid MongoDB ObjectId
  ], async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const employeeId = req.params.employeeId;
      const objectID = ObjectId(employeeId)
  
      // Check if the employee with the given ID exists
      const existingEmployee = await employees.findOne({ _id: objectID });
  
      if (!existingEmployee) {
        return res.status(404).json({ error: 'Employee not found' });
      }
  
      // Delete the employee from the database
      const result = await employees.deleteOne({ _id: objectID });
  
  
      if (result.deletedCount === 1) {
        res.status(200).json({ message: 'Employee deleted successfully' });
      } else {
        res.status(500).json({ error: 'Failed to delete employee' });
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      res.status(500).json({ error: 'Error deleting employee' });
    }
  });
   


app.get('/employeeHierarchy', async (req, res) => {
    try {
  
      // Query all employees
      const result = await employees.find().toArray();
  
      // Create a dictionary to store the hierarchy
      const hierarchy = {};
  
      // Create a function to build the hierarchy recursively
      function buildHierarchy(employee) {
        const supervisor = employee.supervisor;
        const employeeName = employee.name;
  
        if (!supervisor) {
          // Employee has no supervisor, add to the top level
          hierarchy[employeeName] = [];
        } else {
          // Employee has a supervisor, add to their supervisor's hierarchy
          if (hierarchy[supervisor]) {
            hierarchy[supervisor].push({ [employeeName]: [] });
          } else {
            // Create a new hierarchy for the supervisor
            hierarchy[supervisor] = [{ [employeeName]: [] }];
          }
        }
      }
  
      // Build the hierarchy for each employee
      result.forEach(buildHierarchy);
  
  
      res.status(200).json(hierarchy);
    } catch (error) {
      console.error('Error retrieving employee hierarchy:', error);
      res.status(500).json({ error: 'Error retrieving employee hierarchy' });
    }
  });



  app.get('/api/employeeHierarchy', async (req, res) => {
    try {
      
  
      const result = await employees.find({}).toArray();
  
      // Create a map of employee data using their _id as the key
      const employeeMap = {};
      result.forEach((employee) => {
        employeeMap[employee._id.toString()] = {
          name: employee.name,
        //   supervisorId: employee.supervisor,
          subordinates: [],
        };
      });
  
      // Build the hierarchy by associating employees with their supervisors
      const hierarchy = {};
  
      result.forEach((employee) => {
        const employeeId = employee._id.toString();
        if (!employee.supervisor) {
          // Employee has no supervisor, add to the top level
          hierarchy[employeeId] = employeeMap[employeeId];
        } else {
          // Add the employee as a subordinate to their supervisor
          const supervisorId = employee.supervisor.toString();
          if (employeeMap[supervisorId]) {
            employeeMap[supervisorId].subordinates.push(employeeMap[employeeId]);
          }
        }
      });
  
      // Convert the hierarchy object to an array
      const hierarchyArray = Object.values(hierarchy);
  
  
      res.status(200).json(hierarchyArray);
    } catch (error) {
      console.error('Error retrieving employee hierarchy:', error);
      res.status(500).json({ error: 'Error retrieving employee hierarchy' });
    }
  });
  


});


   
app.listen(3000, () => console.log('Server is running on port 3000'));
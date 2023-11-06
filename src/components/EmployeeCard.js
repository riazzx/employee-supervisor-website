import React, { useState, useEffect } from 'react';
import '../App.css';
import { Card,CardBody, Row, Col, ButtonGroup, CardTitle, CardText, Button, Modal, ModalHeader, ModalBody, ModalFooter, Alert, FormGroup, Label, Input } from 'reactstrap';

const EmployeeCard = (args) => {
  const [employees, setEmployees] = useState([]);
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const [modal2, setModal2] = useState(false);
  const toggle2 = () => setModal2(!modal2);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  


  useEffect(() => {
    // Fetch the list of employees from your API
    fetch('http://localhost:3000/employees')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setEmployees(data);
       
      })
      .catch((error) => {
        console.error('Error fetching employees:', error);
      });
  }, []);

  const employeeListForDropdown = employees.map((employee) => ({

  }))



  const assignSupervisor = (employeeId, supervisorId) => {
    // Implement the logic to assign a supervisor to the employee
    fetch(`http://localhost:3000/setSupervisor/${employeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ supervisorId }),
      })
        .then((response) => response.json())
        .then(() => {
            
          // Update the employees state with the updated employee data
        //   const updatedEmployees = employees.map((employee) => {
        //     if (employee._id === employeeId) {
        //       return {
        //         ...employee,
        //         supervisor: data.supervisorId, // Update supervisor ID
        //       };
        //     }
        //     return employee;
        //   });
        //   setEmployees(updatedEmployees);
        setShowSuccessAlert(true); // Show the success alert
          setTimeout(() => {
            window.location.reload();
            setShowSuccessAlert(false); // Hide the success alert after a few seconds
          }, 2000);
        })
        .catch((error) => console.error('Error assigning supervisor:', error));
    // You can open a modal or a form for supervisor assignment
    console.log(`Assign supervisor for employee ID ${employeeId}, supervisor ID ${supervisorId}`);
  };

  const deleteEmployee = (employeeId) => {
    // Implement the logic to delete an employee
    fetch(`http://localhost:3000/deleteEmployee/${employeeId}`, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then(() => {
          // Update the employees state by removing the deleted employee
        //   const updatedEmployees = employees.filter((employee) => employee._id !== employeeId);
        //   setEmployees(updatedEmployees);
          setShowSuccessAlert(true); // Show the success alert
          setTimeout(() => {
            window.location.reload();
            setShowSuccessAlert(false); // Hide the success alert after a few seconds
          }, 2000);
        })
        .catch((error) => console.error('Error deleting employee:', error));
    // You can confirm the deletion with a modal or dialog
    console.log(`Delete employee with ID ${employeeId}`);
  };
  
//   // Function to fetch the supervisor's name by their ID
//   const getSupervisorName = async (supervisorId) => {
//     try {
//       const response = await fetch(`http://localhost:3000/employees/${supervisorId}`); // Replace with your actual API endpoint
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       const data = await response.json();
      
//       console.log(data.name)
//       return data.name;
//     } catch (error) {
//       console.error('Error fetching supervisor name:', error);
//       return 'N/A'; // Return a default value if there's an error
//     }
//   };
  

  return (
    <div className="employee-card-container">
    
        <Row>

        
      {employees.map((employee) => (
        <Col className='employee-list-col'  md="4" >
        
        <Card  key={employee._id}>
          <CardBody>
            <CardTitle>Name: {employee.name}</CardTitle>
            <CardText>Email: {employee.email}</CardText>
            <CardText>
            Supervisor: {employee.supervisor ? employee.supervisor : 'None'}
            </CardText>
            <ButtonGroup>
            <Button color='primary'
              onClick={toggle2}
              disabled={employee.supervisor !== undefined}
            >
              Assign Supervisor
            </Button>
            <Button  color='danger' onClick={toggle} >Delete Employee</Button>
            </ButtonGroup>
           
           
          </CardBody>
          <Modal isOpen={modal} toggle={toggle} {...args}>
        <ModalHeader toggle={toggle}>Delete Employee</ModalHeader>
        <ModalBody>
        {showSuccessAlert && (
        <Alert color="success">Employee deleted successfully!</Alert>
      )}
         Are your sure you want to delete this employee?

        </ModalBody>
        <ModalFooter>
            <Button color='danger' onClick={() => deleteEmployee(employee._id)} >Confirm Delete</Button>
          {' '}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modal2} toggle={toggle2} {...args}>
        <ModalHeader toggle={toggle2}>Assign Supervisor</ModalHeader>
        <ModalBody>
        {showSuccessAlert && (
        <Alert color="success">Supervisor assigned successfully!</Alert>
      )}
           <FormGroup>
    <Label for="supervisorDropdown">Select Supervisor:</Label>
    <Input
      type="select"
      id="supervisorDropdown"
      value={selectedSupervisor}
      onChange={(e) => setSelectedSupervisor(e.target.value)}
    >
      <option value="" disabled>Select a supervisor</option>
      {employees.map((employee) => (
        <option key={employee._id} value={employee._id}>
          {employee.name}
        </option>
      ))}
    </Input>
  </FormGroup>
  <Button
    color="primary"
    onClick={() => {
      // Handle assigning supervisor
      assignSupervisor(employee._id, selectedSupervisor);
      
    }}
  >
    Assign Supervisor
  </Button>

        </ModalBody>
        <ModalFooter>
            {/* <Button color='info'  >Assign Supervisor</Button> */}
          {' '}
          <Button color="secondary" onClick={toggle2}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

     
      {/* onClick={() => assignSupervisor(employee._id)} */}
        </Card>
        </Col>
        
      ))}

</Row>
    </div>
  );
};

export default EmployeeCard;

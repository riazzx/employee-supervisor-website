import React, { useState, useEffect } from "react";
import "../App.css";
import {
    Card,
    CardBody,
    Row,
    Col,
    ButtonGroup,
    CardTitle,
    CardText,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Alert,
    FormGroup,
    Label,
    Input,
} from "reactstrap";

const EmployeeCard = (args) => {
    const [employees, setEmployees] = useState([]);
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const [modal2, setModal2] = useState(false);
    const toggle2 = () => setModal2(!modal2);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [selectedSupervisor, setSelectedSupervisor] = useState("");

    useEffect(() => {
        fetch("http://localhost:3000/employees")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                setEmployees(data);
            })
            .catch((error) => {
                console.error("Error fetching employees:", error);
            });
    }, []);

    const assignSupervisor = (employeeId, supervisorId) => {
        fetch(`http://localhost:3000/setSupervisor/${employeeId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ supervisorId }),
        })
            .then((response) => response.json())
            .then(() => {
                setShowSuccessAlert(true);
                setTimeout(() => {
                    window.location.reload();
                    setShowSuccessAlert(false);
                }, 2000);
            })
            .catch((error) =>
                console.error("Error assigning supervisor:", error)
            );
    };

    const deleteEmployee = (employeeId) => {
        fetch(`http://localhost:3000/deleteEmployee/${employeeId}`, {
            method: "DELETE",
        })
            .then((response) => response.json())
            .then(() => {
                setShowSuccessAlert(true);
                setTimeout(() => {
                    window.location.reload();
                    setShowSuccessAlert(false);
                }, 2000);
            })
            .catch((error) => console.error("Error deleting employee:", error));
    };

    return (
        <div className="employee-card-container">
            <Row>
                {employees.map((employee) => (
                    <Col className="employee-list-col" md="4">
                        <Card key={employee._id}>
                            <CardBody>
                                <CardTitle>Name: {employee.name}</CardTitle>
                                <CardText>Email: {employee.email}</CardText>
                                <CardText>
                                    Supervisor:{" "}
                                    {employee.supervisor
                                        ? employee.supervisor
                                        : "None"}
                                </CardText>
                                <ButtonGroup>
                                    <Button
                                        color="primary"
                                        onClick={toggle2}
                                        disabled={
                                            employee.supervisor !== undefined
                                        }
                                    >
                                        Assign Supervisor
                                    </Button>
                                    <Button color="danger" onClick={toggle}>
                                        Delete Employee
                                    </Button>
                                </ButtonGroup>
                            </CardBody>
                            <Modal isOpen={modal} toggle={toggle} {...args}>
                                <ModalHeader toggle={toggle}>
                                    Delete Employee
                                </ModalHeader>
                                <ModalBody>
                                    {showSuccessAlert && (
                                        <Alert color="success">
                                            Employee deleted successfully!
                                        </Alert>
                                    )}
                                    Are your sure you want to delete this
                                    employee?
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="danger"
                                        onClick={() =>
                                            deleteEmployee(employee._id)
                                        }
                                    >
                                        Confirm Delete
                                    </Button>{" "}
                                    <Button color="secondary" onClick={toggle}>
                                        Cancel
                                    </Button>
                                </ModalFooter>
                            </Modal>

                            <Modal isOpen={modal2} toggle={toggle2} {...args}>
                                <ModalHeader toggle={toggle2}>
                                    Assign Supervisor
                                </ModalHeader>
                                <ModalBody>
                                    {showSuccessAlert && (
                                        <Alert color="success">
                                            Supervisor assigned successfully!
                                        </Alert>
                                    )}
                                    <FormGroup>
                                        <Label for="supervisorDropdown">
                                            Select Supervisor:
                                        </Label>
                                        <Input
                                            type="select"
                                            id="supervisorDropdown"
                                            value={selectedSupervisor}
                                            onChange={(e) =>
                                                setSelectedSupervisor(
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="" disabled>
                                                Select a supervisor
                                            </option>
                                            {employees.map((employee) => (
                                                <option
                                                    key={employee._id}
                                                    value={employee._id}
                                                >
                                                    {employee.name}
                                                </option>
                                            ))}
                                        </Input>
                                    </FormGroup>
                                    <Button
                                        color="primary"
                                        onClick={() => {
                                            assignSupervisor(
                                                employee._id,
                                                selectedSupervisor
                                            );
                                        }}
                                    >
                                        Assign Supervisor
                                    </Button>
                                </ModalBody>
                                <ModalFooter>
                                    {" "}
                                    <Button color="secondary" onClick={toggle2}>
                                        Cancel
                                    </Button>
                                </ModalFooter>
                            </Modal>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default EmployeeCard;

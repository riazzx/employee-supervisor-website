import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import React, { useState, useEffect } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useNavigate,
} from "react-router-dom";
import NavBar from "./components/NavBar";
import {
    Container,
    Row,
    Col,
    Form,
    FormGroup,
    Label,
    Input,
    Button,
} from "reactstrap";
import EmployeeCard from "./components/EmployeeCard";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import AddEmployeeForm from "./components/AddEmployee";
import { JSONTree } from "react-json-tree";

function Home(args) {
    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/employees")
            .then((response) => response.json())
            .then((data) => setEmployees(data))
            .catch((error) =>
                console.error("Error fetching employees:", error)
            );
    }, []);

    const addEmployee = (employeeData) => {
        fetch("http://localhost:3000/addEmployee", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(employeeData),
        }).catch((error) => console.error("Error adding employee:", error));
    };

    function EmployeeHierarchy() {
        const [hierarchicalData, setHierarchicalData] = useState({});

        useEffect(() => {
            fetch("http://localhost:3000/employeeHierarchy")
                .then((response) => response.json())
                .then((data) => setHierarchicalData(data))
                .catch((error) =>
                    console.error("Error fetching hierarchical data:", error)
                );
        }, []);

        return (
            <div>
                <h1>Employee Hierarchy</h1>
                <pre>{JSON.stringify(hierarchicalData, null, 2)}</pre>

                <JSONTree
                    data={hierarchicalData}
                    labelRenderer={(
                        keyPath,
                        nodeType,
                        expanded,
                        expandable
                    ) => (
                        <span style={{ fontWeight: "bold" }}>
                            {keyPath.join(".")}
                        </span>
                    )}
                    valueRenderer={(raw, value, keyPath) => (
                        <span style={{ fontStyle: "italic" }}>{value}</span>
                    )}
                />
            </div>
        );
    }

    return (
        <div>
            <NavBar />
            <div className="employee-list">
                <h1>Home</h1>

                <div className="add-employee">
                    <h3>Add Employee</h3>
                    <br></br>
                    <Button color="primary" size="lg" onClick={toggle}>
                        Add Employee
                    </Button>
                    <Modal isOpen={modal} toggle={toggle} {...args}>
                        <ModalHeader toggle={toggle}>Modal title</ModalHeader>
                        <ModalBody>
                            <AddEmployeeForm addEmployee={addEmployee} />
                        </ModalBody>
                        <ModalFooter>
                            {" "}
                            <Button color="secondary" onClick={toggle}>
                                Cancel
                            </Button>
                        </ModalFooter>
                    </Modal>
                </div>

                <h3>All Employees</h3>

                <EmployeeCard />
            </div>
            <div className="employee-hierarchy">
                <EmployeeHierarchy />
            </div>
        </div>
    );
}

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    // const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                navigate("/home");
                // setLoggedIn(true);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.error(error);
            setMessage("An error occurred");
        }
    };

    return (
        <div>
            <NavBar />
            <div className="login-container">
                <Container>
                    <Row>
                        <Col md={{ size: 6, offset: 3 }}>
                            <h1>Login</h1>
                            <br></br>
                            <Form onSubmit={handleLogin}>
                                <FormGroup>
                                    <Label for="username">Username:</Label>
                                    <Input
                                        type="text"
                                        id="username"
                                        value={username}
                                        onChange={(e) =>
                                            setUsername(e.target.value)
                                        }
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="password">Password:</Label>
                                    <Input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />
                                </FormGroup>
                                <Button type="submit" color="primary">
                                    Login
                                </Button>
                            </Form>
                            {message && <p>{message}</p>}
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<Home />} />
            </Routes>
        </Router>
    );
}

export default App;

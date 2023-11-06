import React, { useState } from "react";
import { Form, FormGroup, Label, Input, Button, Alert } from "reactstrap";

function AddEmployeeForm({ addEmployee }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim() === "" || email.trim() === "") {
            return;
        }
        addEmployee({ name, email });
        setName("");
        setEmail("");
        setShowSuccessAlert(true);
        setTimeout(() => {
            window.location.reload();
            setShowSuccessAlert(false);
        }, 2000);
    };

    return (
        <Form onSubmit={handleSubmit}>
            {showSuccessAlert && (
                <Alert color="success">Employee added successfully!</Alert>
            )}
            <FormGroup>
                <Label for="name">Name:</Label>
                <Input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </FormGroup>
            <FormGroup>
                <Label for="email">Email:</Label>
                <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormGroup>
            <Button color="primary" type="submit">
                Add Employee
            </Button>
        </Form>
    );
}

export default AddEmployeeForm;

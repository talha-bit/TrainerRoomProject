import React, {useEffect, useState} from "react";
import Form from 'react-bootstrap/Form'
import axios from "axios";
import {Link} from "react-router-dom";

const Profile = (props) => {

    const [id, setID] = useState("")
    const [user, setUser] = useState({})
    const [errors, setErrors] = useState([])
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [cNewPassword, setCNewPassword] = useState("")

    useEffect(() => {
        setID(props.match.params.id)
    }, [])

    useEffect(() => {
        axios.post("http://localhost:5000/api/users/getCustomer", {id: props.match.params.id})
            .then((res) => {
                setUser(res.data.customer);
            })
            .catch(err => console.log(err))
    }, [])

    const handleReset = () => {
        if (newPassword !== cNewPassword) {
            setErrors((prev) => [...prev, "Passwords do not match"])
        }
        if(newPassword.length < 6){
            setErrors((prev) => [...prev, "Password must be at least 6 characters"])
        }
            else {
            setErrors([])
            const requestData = {id, oldPassword, newPassword, cNewPassword};
            axios.post("http://localhost:5000/api/users/resetPassword", requestData)
                .then((res) => {
                    if (res.data.ok) {
                        console.log("Password changed successfully.")
                        props.history.push('/dashboard')
                    } else if(res.data.error){
                        console.log(res.data.error)
                       setErrors((prev) => [...prev, res.data.error])
                    }
                })
                .catch(err => console.log(err))
        }
    }

    return (<>
        <div style={{height: "75vh"}} className="container valign-wrapper">
            <div className="row">
                <Link to="/" className="btn-flat waves-effect">
                    <i className="material-icons left">keyboard_backspace</i> Back to dashboard
                </Link>
                <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control placeholder={user.name} disabled/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control placeholder={user.email} disabled/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Old Password</Form.Label>
                    <Form.Control
                        onChange={e => setOldPassword(e.target.value)}
                        type="password"
                        id="oldPassword"/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                        onChange={e => setNewPassword(e.target.value)}
                        type="password"
                        id="newPassword"
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                        onChange={e => setCNewPassword(e.target.value)}
                        type="password"
                        id="cNewPassword"
                    />
                </Form.Group>
                <span className="red-text">
                  {errors && errors.map((err => <>{err} <br/></>))}
                </span>
                <button
                    style={{
                        width: "200px", borderRadius: "3px", letterSpacing: "1.5px", marginTop: "1rem"
                    }}
                    onClick={handleReset}
                    className="btn btn-large ms-lg-3 waves-effect waves-light hoverable blue accent-3"
                >
                    Save Changes
                </button>
            </div>
        </div>
    </>)

}

export default Profile
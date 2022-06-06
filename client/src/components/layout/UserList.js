import React from "react";
import UserCard from "./partials/UserCard";
import {Table} from "react-bootstrap";


const UserList = (props) => {

    const users = props.users
    return (
        <>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Options</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) =>
                    <UserCard removeHandler={props.removeHandler} id={users.indexOf(user) + 1} key={user._id}
                              user={user}/>
                )}
                </tbody>
            </Table>
        </>
    )
}

export default UserList
import React from "react";
import {Button} from "react-bootstrap";


const UserCard = (props) => {

    const handler = () => {
        props.removeHandler(props.user)
    }

    return (
        <tr>
            <th>{props.id}</th>
            <th>{props.user.name}</th>
            <th>{props.user.email}</th>
            <th>
                <Button onClick={handler} variant="primary">Remove</Button>
            </th>
        </tr>
    )
}

export default UserCard
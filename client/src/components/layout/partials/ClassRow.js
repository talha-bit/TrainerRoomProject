import React from "react";
import {Button, Card} from "react-bootstrap";

const ClassesList = (props) => {

    const handler = () => {
        props.onJoinHandler(props.c)
    }

    return (
        <>
            <Card className="rounded-3"
                  style={{width: '18rem', margin: '10px', backgroundColor: '#38393a', color: 'white'}}>
                <Card.Body>
                    <Card.Title><h5><b>{props.c.name}</b></h5></Card.Title>
                    <Card.Text style={{color: '#bbb8b8'}}>
                        {props.c.description}
                    </Card.Text>
                    <Button onClick={handler} variant="primary">Join</Button>
                </Card.Body>
            </Card>
        </>
    )
}

export default ClassesList
import React from "react";
import ClassRow from "../layout/partials/ClassRow"

const ClassesList = (props) => {
    return (
        <>
            {props.classes.map(c =>
                <ClassRow onJoinHandler={props.onJoinHandler} key={c.id} c={c}/>
            )}
        </>
    )
}

export default ClassesList
import React, {useEffect, useState} from "react";
import axios from "axios";
import UserList from "../layout/UserList";


const ViewUsersByAdmin = () => {

    const [customers, setCustomer] = useState([]);
    const [customerToBeRemoved, setCustomerToBeRemoved] = useState();

    const [trainers, setTrainers] = useState([]);
    const [trainerToBeRemoved, setTrainerToBeRemoved] = useState();

    const removeCustomerHandler = (customer) => {
        console.log(customer)
        setCustomerToBeRemoved(customer._id)
    }

    const removeTrainerHandler = (trainer) => {
        console.log(trainer)
        setTrainerToBeRemoved(trainer._id)
    }

    useEffect(() => {
        axios.get('http://localhost:5000/api/users/getCustomers')
            .then((res) => {
                setCustomer(res.data.customers);
            })
            .catch(err => console.error(err));

        axios.get('http://localhost:5000/api/users/getTrainers')
            .then((res) => {
                setTrainers(res.data.trainers);
            })
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        axios.post('http://localhost:5000/api/users/deleteCustomer', {toBeRemoved: customerToBeRemoved})
            .then((res) => {
                setCustomer(res.data.customers);
            })
            .catch((err) => console.error(err))
    }, [customerToBeRemoved])

    useEffect(() => {
        axios.post('http://localhost:5000/api/users/deleteTrainer', {toBeRemoved: trainerToBeRemoved})
            .then((res) => {
                setTrainers(res.data.trainers);
            })
            .catch((err) => console.error(err))
    }, [trainerToBeRemoved])

    return (<>
        <div className="row mt-5">

            {customers.length === 0 ? <h3> There are no customers </h3> : <div>
                <h2 style={{color: "#062a59"}} className="m-lg-4 fw-bold"> Customers </h2>
                <div className="landing-copy col s12 center-align mt-5">
                    <UserList removeHandler={removeCustomerHandler} users={customers}/>
                </div>
            </div>}

        </div>
        <div className="row mt-5">

            {trainers.length === 0 ? <h3> There are no trainers </h3> : <div>
                <h2 style={{color: "#062a59"}} className="m-lg-4 fw-bold"> Trainers </h2>
                <div className="landing-copy col s12 center-align mt-5">
                    <UserList removeHandler={removeTrainerHandler} users={trainers}/>
                </div>
            </div>}

        </div>
    </>);
}


export default ViewUsersByAdmin

import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {logoutUser} from "../../actions/authActions";
import axios from "axios";
import ClassesList from "../layout/ClassesList"
import {ButtonGroup, DropdownButton, SplitButton, Dropdown} from "react-bootstrap";

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dropdownValue: "", classes: []
        }
    }

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    onViewUsers = e => {
        e.preventDefault()
        this.props.history.push('/admin/users');
    }

    onViewProfile = e => {
        e.preventDefault()
        this.props.history.push({
            pathname: `/profile/${this.props.auth.user.id}`, state: {
                user: this.props.auth.user
            }
        });
    }

    onJoinHandler = c => {
        console.log("Attempt to join class: ", c.name)
        axios.post("http://localhost:5000/api/users/joinClass", {user: this.props.auth.user, classToJoin: c})
            .then(res => console.log(res.data.code))
            .catch(err => console.error(err))
    }

    dropDownHandler = e => {
        e.preventDefault()
        console.log(e)
    }

    componentDidMount() {
        if (this.props.auth.user.userType === "Customer") {

            axios.get("http://localhost:5000/api/users/getClasses")
                .then(res => this.setState({classes: res.data.classes}))
                .catch(err => console.error(err))
        }
    }

    render() {
        const {user} = this.props.auth;

        return (<>
                <div className="mt-5">
                    <button
                        onClick={this.onLogoutClick}
                        className="btn btn-small waves-effect waves-light float-end m-2 blue accent-3"
                    >
                        Logout
                    </button>

                    {user.userType === "Admin" && <button
                        onClick={this.onViewUsers}
                        className="btn btn-small mt-2 float-end ms-lg-3 waves-effect waves-light hoverable blue accent-3"
                    >
                        View Users
                    </button>}
                    {user.userType === "Customer" && <button
                        onClick={this.onViewProfile}
                        className="btn btn-small mt-2 float-end ms-lg-3 waves-effect waves-light hoverable blue accent-3"
                    >
                        View Profile
                    </button>}
                </div>
                <div className="container valign-wrapper">
                    <div className="row">
                        <div className="landing-copy col s12 left-align">
                            {/*<h4>*/}
                            {/*    <b>Hey there,</b> {user.name.split(" ")[0]}*/}
                            {/*</h4>*/}
                            <div className="row mt-2">
                                {this.state.classes.length === 0 ? <h3> There are no classes </h3> :
                                    <>
                                        <h2> Classes To Join </h2>
                                        <ClassesList onJoinHandler={this.onJoinHandler} classes={this.state.classes}/>
                                    </>}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

Dashboard.propTypes = {
    logoutUser: PropTypes.func.isRequired, auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, {logoutUser})(Dashboard);

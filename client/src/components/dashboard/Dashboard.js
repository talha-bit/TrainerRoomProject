import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {logoutUser} from "../../actions/authActions";
import axios from "axios";
import ClassesList from "../layout/ClassesList"
import FlashMessage from 'react-flash-message'

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            message: "",
            showMessage: false,
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
            .then(res => {
                console.log(res.data.code);
                this.setState({
                    showMessage: true,
                    message: res.data.code
                }, () => {
                    setTimeout(() => {
                        this.setState({showMessage: false});
                    }, 2000)
                })
            })
            .catch(err => console.error(err))
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
                {this.state.showMessage &&
                    <div className="m-5 rounded-3 h5 h-25 green text-center">
                        <FlashMessage duration={2000}>
                            <strong>{this.state.message}</strong>
                        </FlashMessage>
                    </div>
                }
                <div className="mt-5">
                    <button
                        onClick={this.onLogoutClick}
                        className="btn btn-small waves-effect waves-light float-end m-2 red accent-3"
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
                        Reset Password
                    </button>}
                </div>
                {user.userType === "Admin" &&
                    <h1 className="m-lg-4"><b> Admin Portal </b></h1>
                }
                <div className="container valign-wrapper">
                    <div className="row">
                        <div className="landing-copy col s12 left-align">
                            {/*<h2>*/}
                            {/*    <b>Hey there,</b> {user.name.split(" ")[0]}*/}
                            {/*</h2>*/}
                            <div className="row mt-2">
                                {user.userType === "Customer" && this.state.classes.length > 0 &&
                                    <>
                                        <h2><b> Classes To Join </b></h2>
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

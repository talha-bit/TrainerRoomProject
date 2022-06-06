import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {logoutUser} from "../../actions/authActions";

class Dashboard extends Component {
    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    onViewUsers = e => {
        e.preventDefault()
        this.props.history.push('/admin/users');
    }

    render() {
        const {user} = this.props.auth;

        return (
            <div style={{height: "75vh"}} className="container valign-wrapper">
                <div className="row">
                    <div className="landing-copy col s12 center-align">
                        <h4>
                            <b>Hey there,</b> {user.name.split(" ")[0]}
                            <p className="flow-text grey-text text-darken-1" style={{font: 'Century Gothic'}}>
                                You are logged in as an a(n) {user.userType}
                            </p>
                        </h4>
                        <button
                            style={{
                                width: "150px",
                                borderRadius: "3px",
                                letterSpacing: "1.5px",
                                marginTop: "1rem"
                            }}
                            onClick={this.onLogoutClick}
                            className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                        >
                            Logout
                        </button>

                        {user.userType === "Admin" &&
                            <button
                                style={{
                                    width: "200px",
                                    borderRadius: "3px",
                                    letterSpacing: "1.5px",
                                    marginTop: "1rem"
                                }}
                                onClick={this.onViewUsers}
                                className="btn btn-large ms-lg-3 waves-effect waves-light hoverable blue accent-3"
                            >
                                View Users
                            </button>}
                    </div>
                </div>
            </div>
        );
    }
}

Dashboard.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    {logoutUser}
)(Dashboard);

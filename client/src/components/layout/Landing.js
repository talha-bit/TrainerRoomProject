import React, {Component} from "react";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import image from '../../images/image.jpg'

class Landing extends Component {
    componentDidMount() {
        // If logged in and user navigates to Login page, should redirect them to dashboard
        if (this.props.auth.isAuthenticated) {
            this.props.history.push("/dashboard");
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.auth.isAuthenticated) {
            this.props.history.push("/dashboard");
        }

        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors,
            });
        }
    }

    render() {
        return (
            <div
                style={{
                    height: "94vh",
                    width: '100%',
                    backgroundImage: `url(${image})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                }}
                className="valign-wrapper"
            >
                <div className="row">
                    <div className="col s12 center-align">
                        <h4>
                            <b>Your </b> body needs us.
                        </h4>
                        <p className="flow-text grey-black text-darken-1">Join Today.</p>
                        <br/>
                        <div className="col s6">
                            <Link
                                to="/register"
                                style={{
                                    width: "140px",
                                    borderRadius: "3px",
                                    letterSpacing: "1.5px",
                                }}
                                className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                            >
                                Register
                            </Link>
                        </div>
                        <div className="col s6">
                            <Link
                                to="/login"
                                style={{
                                    width: "140px",
                                    borderRadius: "3px",
                                    letterSpacing: "1.5px",
                                }}
                                className="btn btn-large btn-flat waves-effect white black-text"
                            >
                                Log In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Landing.propTypes = {
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors,
});

export default connect(mapStateToProps)(Landing);

// export default Landing;

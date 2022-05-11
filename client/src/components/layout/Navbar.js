import React, { Component } from "react";
import { Link } from "react-router-dom";
import Logo from './partials/Logo'

class Navbar extends Component {
  render() {
    return (
      <div className="navbar-fixed " >
        <nav className="z-depth-2 " style={{height: '80px'}}>
          <div className="nav-wrapper white" style={{backgroundColor: '#2979ff'}}>
            <Link
              to="/"
              style={{
                fontFamily: "monospace"
              }}
              className="col s5 brand-logo center black-text"
            >
              <Logo style={{display: 'inline-block'}}/> 
              <span style={{display: 'inline-block', marginLeft: '10px'}}>TRAINER ROOM </span>
            </Link>
          </div>
        </nav>
      </div>
    );
  }
}

export default Navbar;

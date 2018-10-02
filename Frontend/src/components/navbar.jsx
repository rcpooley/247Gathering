// @flow
import React from 'react';
import '../css/navbar.css';

type Props = {}

class Navbar extends React.Component<Props> {
    render() {
        return (
            <nav className="navbar navbar-expand-md navbar-dark">
                <a className="navbar-brand" href="#">247</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"/>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item active">
                            <a className="nav-link" href="#">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Calendar</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">About us</a>
                        </li>
                    </ul>
                </div>
            </nav>
        )
    }
}

export default Navbar;

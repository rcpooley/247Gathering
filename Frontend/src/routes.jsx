// @flow
import React from 'react';
import Home from './components/home';
import Navbar from './components/navbar';
import './css/routes.css';

type Props = {
}

class Routes extends React.Component<Props> {

    render() {
        return (
            <div id="routes">
                <div id="navbar">
                    <Navbar />
                </div>
                <Home />
            </div>
        )
    }

}

export default Routes;

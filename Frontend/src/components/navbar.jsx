// @flow
import * as React from 'react';
import '../css/navbar.css';

type Props = {}

type State = {
    toggled: boolean
}

declare function $(a: any): any;

class Navbar extends React.Component<Props, State> {

    navbar: any;
    evts: Array<any>;

    constructor(props: Props) {
        super(props);

        this.navbar = React.createRef();
        this.evts = [];
        this.state = {
            toggled: false
        };
    }

    componentDidMount() {
        this.evts.push(() => this.handleToggle(true), () => this.handleToggle(false));
        $(this.navbar.current).on('show.bs.collapse ', this.evts[0]);
        $(this.navbar.current).on('hide.bs.collapse ', this.evts[1]);
    }

    componentWillUnmount() {
        $(this.navbar.current).off('show.bs.collapse ', this.evts[0]);
        $(this.navbar.current).off('hide.bs.collapse ', this.evts[1]);
    }

    handleToggle(show: boolean) {
        this.setState({toggled: show});
        console.log('toggled', show);
    }

    render() {
        return (
            <div>
                <div className={`page-cover${this.state.toggled ? ' visible' : ''}`} />
                <nav ref={this.navbar} className="navbar navbar-expand-md navbar-dark">

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
            </div>
        )
    }
}

export default Navbar;

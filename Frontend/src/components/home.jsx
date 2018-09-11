// @flow
import React from 'react';
import '../css/home.css';
import imgBackground from '../assets/background.jpg';

type Props = {
}

type Dimension = {
    width: number,
    height: number
}

type State = {
    bgOriginalDims: Dimension,
    screenDims: Dimension,
    imgDims: Dimension,
    resizeListener: any
}

class Home extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            bgOriginalDims: {
                width: 0,
                height: 0
            },
            imgDims: {
                width: 0,
                height: 0,
            },
            screenDims: {
                width: 0,
                height: 0
            },
            resizeListener: null
        };
    }

    componentDidMount() {
        const rl = () => this.onScreenResize();
        this.setState({
            resizeListener: rl
        });
        window.addEventListener('resize', rl);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.state.resizeListener);
    }

    onScreenResize() {
        const screen = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        const orig = this.state.bgOriginalDims;

        // test img width = screen width
        let imgDims = {
            width: screen.width,
            height: Math.floor(orig.height / orig.width * screen.width)
        };

        if (imgDims.height < screen.height) {
            imgDims = {
                width: Math.floor(orig.width / orig.height * screen.height),
                height: screen.height
            };
        }

        this.setState({
            screenDims: screen,
            imgDims
        });
    }

    onBackgroundLoad(img: Dimension) {
        this.setState({
            bgOriginalDims: {
                width: img.width,
                height: img.height
            }
        }, () => this.onScreenResize());
    }

    render() {
        let imgDims = {};
        let imgOffset = {};
        if (this.state.imgDims.width > 0) {
            imgDims = this.state.imgDims;
            imgOffset = {
                left: -(imgDims.width - this.state.screenDims.width) / 2,
                top: -(imgDims.height - this.state.screenDims.height) / 2
            }
        }

        return (
            <div className="component home">
                <div className="section-primary" style={{height: this.state.screenDims.height}}>
                    <div className="img-wrapper" style={imgOffset}>
                        <img onLoad={e => this.onBackgroundLoad(e.target)} src={imgBackground} { ...imgDims } />
                    </div>
                    <div className="content">
                        <div className="header">
                            Welcome to 247
                        </div>
                        <div className="subtext">
                            Our mission is to Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default Home;

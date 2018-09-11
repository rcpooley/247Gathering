import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes';

ReactDOM.render(<Routes/>, document.getElementById('root'));

// Hot module replacement
if (module.hot) {
    module.hot.accept();
}

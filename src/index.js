import React from 'react';
import ReactDOM from 'react-dom';
//import App from './App';
import Routers from './Routers/Routers';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import 'semantic-ui-css/semantic.min.css';

ReactDOM.render(<Routers />, document.getElementById('root'));
registerServiceWorker();

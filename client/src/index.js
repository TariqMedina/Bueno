import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import './index.css';
// import * as serviceWorker from './serviceWorker';

(function() {
    var childProcess = require("child_process");
    var oldSpawn = childProcess.spawn;
    function mySpawn() {
        console.log('spawn called');
        console.log(arguments);
        var result = oldSpawn.apply(this, arguments);
        return result;
    }
    childProcess.spawn = mySpawn;
})();

ReactDOM.render(<App />, document.getElementById('root'));

// serviceWorker.unregister();


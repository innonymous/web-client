import React from 'react';
import ReactDOM from 'react-dom';

import Innonymous from 'innonymous';
import {CookiesProvider} from 'react-cookie';


ReactDOM.render(
    <React.StrictMode>
        <CookiesProvider>
            <Innonymous/>
        </CookiesProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

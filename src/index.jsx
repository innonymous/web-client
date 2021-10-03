import React from 'react';
import ReactDOM from 'react-dom';

import {BrowserRouter} from 'react-router-dom';
import {CookiesProvider} from 'react-cookie';

import Innonymous from 'innonymous';


ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <CookiesProvider>
                <Innonymous/>
            </CookiesProvider>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);

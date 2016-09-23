import React from 'react';
import TripBox from './TripBox';
import {render} from 'react-dom';

render( <TripBox url="/trips" />,
    document.getElementById('content')
);

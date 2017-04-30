import React, { Component } from 'react';

function NavBar(props) {
    return  <div>
        {props.tracy}
        {props.children}
    </div>
}

export default NavBar;

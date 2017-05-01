import React, { Component } from 'react';

class ChangeTheme extends Component {
    render() {
        return(
            <div className="Center-align">
                <div>
                    <h5 className="Rxjs-pink">CHANGE COLOR OF APP</h5>
                </div>
                <div>
                    <button className="Rxjs-pink-background White-text Margin-left-right-10">BLUE</button>
                    <button className="Rxjs-pink-background White-text Margin-left-right-10">PURPLE</button>
                    <button className="Rxjs-pink-background White-text Margin-left-right-10">RxJS PINK</button>
                </div>
            </div>
        );
    }
}

export default ChangeTheme;
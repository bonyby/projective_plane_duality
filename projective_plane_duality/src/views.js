import React, { PureComponent } from 'react'

export default class View extends PureComponent {
    render() {
        const canvas = <canvas></canvas>;
        const ctx = canvas.ctx;

        console.log(ctx);

        return (
            <div className="View">
                <h1>{this.props.title}</h1>
                {canvas}
            </div>
        )
    }
}

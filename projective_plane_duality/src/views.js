import React, { PureComponent } from 'react'

export default class View extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            canvasCtx: null
        };
        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        this.setState({
            canvasCtx: this.canvasRef.current.getContext("2d")
        });
    }

    split(str, i) {
        return [str.slice(0, i), str.slice(i)];
    }

    drawObjects() {
        if (this.state.canvasCtx == null) return;

        const ctx = this.state.canvasCtx;
        ctx.clearRect(0, 0, this.canvasRef.width, this.canvasRef.height);


        this.props.objects.forEach(o => {
            const [type, val] = this.split(o, 1);
            const regex = /\(|\)|\s/ig; // Regex (global) to remove all '(', ')' and ' '
            const [x, y] = val.replaceAll(regex, "").split(",");

            ctx.fillRect(x, y, 5, 5);
        });
    }

    render() {
        this.drawObjects();

        return (
            <div className="View">
                <h1>{this.props.title}</h1>
                <canvas ref={this.canvasRef} width={500} height={500}></canvas>
            </div>
        )
    }
}

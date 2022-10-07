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
            // const [type, val] = this.split(o, 1);
            // const regex = /\(|\)|\s/ig; // Regex (global) to remove all '(', ')' and ' '
            // const [x, y] = val.replaceAll(regex, "").split(",");

            const type = o[0];

            switch (type) {
                case "p":
                    const x = o[1];
                    const y = o[2];
                    ctx.fillRect(x, y, 5, 5);
                    break;
                case "l":
                    const p_x = o[1];
                    const p_y = o[2];
                    const start_y = -1000 * p_x + p_y;
                    const end_y = 1000 * p_x + p_y;
                    ctx.beginPath();
                    ctx.strokeWidth = 2;
                    ctx.moveTo(-1000, start_y);
                    ctx.lineTo(1000, end_y);
                    ctx.stroke();
                    break;
                default:
                    console.log("SADNESS INSIDE OF VIEW: " + type);
            }

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

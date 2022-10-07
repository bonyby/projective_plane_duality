import React, { PureComponent } from 'react'

export default class View extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            canvasCtx: null,
            width: this.props.width,
            height: this.props.height,
            xMax: this.props.xMax,
            yMax: this.props.yMax
        };
        this.canvasRef = React.createRef();
        this.origo = [this.state.width / 2, this.state.height / 2];
    }

    componentDidMount() {
        this.setState({
            canvasCtx: this.canvasRef.current.getContext("2d")
        });
    }

    split(str, i) {
        return [str.slice(0, i), str.slice(i)];
    }

    resetCanvas() {
        if (this.state.canvasCtx == null) return;

        const ctx = this.state.canvasCtx;
        ctx.clearRect(0, 0, this.canvasRef.width, this.canvasRef.height);
    }

    drawAxes() {
        if (this.state.canvasCtx == null) return;
        const ctx = this.state.canvasCtx;
        
        const[origoX, origoY] = this.origo;

        // Draw the axes
        ctx.beginPath()
        ctx.strokeWidth = 1;
        ctx.moveTo(0, origoY);
        ctx.lineTo(this.state.width, origoY);
        ctx.stroke()
        ctx.moveTo(origoX, 0);
        ctx.lineTo(origoX, this.state.height);
        ctx.stroke();

        // Draw tick marks
        ctx.font = "12px Arial";
        ctx.fillText("(0,0)", origoX + 2, origoY - 5);
        ctx.fillText("(0," + this.state.yMax + ")", origoX + 2, 12);
        ctx.fillText("(0,-" + this.state.yMax + ")", origoX + 2, this.state.height - 3);
        ctx.fillText("(-" + this.state.xMax + ", 0)", 0, origoY - 5);
        ctx.fillText("(" + this.state.xMax + ", 0)", this.state.width - 35, origoY - 5);
    }

    drawObjects() {
        if (this.state.canvasCtx == null) return;
        const ctx = this.state.canvasCtx;

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
        this.resetCanvas();
        this.drawAxes();
        this.drawObjects();

        return (
            <div className="View">
                <h1>{this.props.title}</h1>
                <canvas ref={this.canvasRef} width={this.state.width} height={this.state.height}></canvas>
            </div>
        )
    }
}

import React, { PureComponent } from 'react'

export default class View extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            canvasCtx: null,
            width: this.props.width,
            height: this.props.height,
            xMax: this.props.xMax,
            yMax: this.props.yMax,
            xScale: this.props.width / (this.props.xMax * 2),
            yScale: this.props.height / (this.props.yMax * 2)
        };
        this.canvasRef = React.createRef();
        this.origo = [this.state.width / 2, this.state.height / 2];
    }

    componentDidMount() {
        const canvas = this.canvasRef;
        const ctx = canvas.current.getContext("2d");
        // ctx.scale(1, -1);
        // ctx.translate(1, 50);
        ctx.setTransform(1, 0, 0, -1, this.state.width / 2, this.state.height / 2);
        // ctx.transform(1, 0, 0, -1, 0, this.state.height);

        this.setState({
            canvasCtx: ctx
        });
    }

    split(str, i) {
        return [str.slice(0, i), str.slice(i)];
    }

    // Only scales x and y
    getScaledPosition(x, y) {
        const newX = x * this.state.xScale;
        const newY = y * this.state.yScale;
        return [newX, newY];
    }

    resetCanvas() {
        if (this.state.canvasCtx == null) return;

        const ctx = this.state.canvasCtx;
        ctx.clearRect(-this.state.width / 2, -this.state.height / 2, this.state.width, this.state.height);
    }

    drawAxes() {
        if (this.state.canvasCtx == null) return;
        const ctx = this.state.canvasCtx;

        const [origoX, origoY] = this.origo;

        ctx.beginPath()
        ctx.strokeWidth = 1;
        ctx.moveTo(-this.state.width / 2, 0);
        ctx.lineTo(this.state.width / 2, 0);
        ctx.stroke()
        ctx.moveTo(0, -this.state.height / 2);
        ctx.lineTo(0, this.state.height / 2);
        ctx.stroke();

        // Draw tick marks
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.font = "12px Arial";
        ctx.fillText("(0,0)", origoX + 2, origoY - 5);
        ctx.fillText("(0," + this.state.yMax + ")", origoX + 2, 12);
        ctx.fillText("(0,-" + this.state.yMax + ")", origoX + 2, this.state.height - 3);
        ctx.fillText("(-" + this.state.xMax + ", 0)", 0, origoY - 5);
        ctx.fillText("(" + this.state.xMax + ", 0)", this.state.width - 35, origoY - 5);
        ctx.restore();
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
                    const [x, y] = this.getScaledPosition(o[1], o[2]);
                    ctx.fillRect(x - 2, y - 2, 5, 5);
                    break;
                case "l":
                    const [_, p_y] = this.getScaledPosition(o[1], o[2]);
                    const p_x = o[1];
                    const start_x = -(this.state.width / 2);
                    const start_y = start_x * p_x + p_y;
                    const end_x = (this.state.width / 2);
                    const end_y = end_x * p_x + p_y;
                    ctx.beginPath();
                    ctx.strokeWidth = 2;
                    ctx.moveTo(start_x, start_y);
                    ctx.lineTo(end_x, end_y);
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

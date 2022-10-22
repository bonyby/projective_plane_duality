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
            const type = o[0];

            // NOTE: all cases have a block {} inside to allow redeclaration of const's between cases
            switch (type) {
                case "p":
                    {
                        const [x, y] = this.getScaledPosition(o[1], o[2]);
                        this.drawPoint(x, y);
                        break;
                    }
                case "l":
                    {
                        const [, p_y] = this.getScaledPosition(o[1], o[2]);
                        const p_x = o[1];
                        const [start_x, start_y, end_x, end_y] = this.getLineCoords(p_x, p_y);
                        this.drawLine(start_x, start_y, end_x, end_y);
                        break;
                    }
                case "s":
                    {
                        const [p_x1, p_y1] = this.getScaledPosition(o[1], o[2]);
                        const [p_x2, p_y2] = this.getScaledPosition(o[3], o[4]);
                        this.drawLine(p_x1, p_y1, p_x2, p_y2);
                        this.drawPoint(p_x1, p_y1);
                        this.drawPoint(p_x2, p_y2);
                        break;
                    }
                case "w":
                    {
                        const [, p_y1] = this.getScaledPosition(o[1], o[2]);
                        const [, p_y2] = this.getScaledPosition(o[3], o[4]);
                        const p_x1 = o[1];
                        const p_x2 = o[3];
                        const [start_x1, start_y1, end_x1, end_y1] = this.getLineCoords(p_x1, p_y1);
                        const [start_x2, start_y2, end_x2, end_y2] = this.getLineCoords(p_x2, p_y2);

                        // Draw filled area (this is ugly code, but works for now)
                        const [a1, b1] = this.getLineFromTwoPoints(start_x1, start_y1, end_x1, end_y1);
                        const [a2, b2] = this.getLineFromTwoPoints(start_x2, start_y2, end_x2, end_y2);
                        const [inter_x, inter_y] = this.getLineIntersectionPoint(a1, b1, a2, b2);

                        const region1 = new Path2D();
                        region1.moveTo(start_x1, start_y1);
                        region1.lineTo(inter_x, inter_y);
                        region1.lineTo(start_x2, start_y2);
                        region1.lineTo(-this.state.width / 2, this.state.height / 2);
                        region1.lineTo(-this.state.width / 2, -this.state.height / 2);
                        region1.closePath();

                        ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
                        ctx.fill(region1);

                        const region2 = new Path2D();
                        region2.moveTo(end_x2, end_y2);
                        region2.lineTo(inter_x, inter_y);
                        region2.lineTo(end_x1, end_y1);
                        region2.lineTo(this.state.width / 2, this.state.height / 2);
                        region2.lineTo(this.state.width / 2, -this.state.height / 2);
                        region2.closePath();

                        ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
                        ctx.fill(region2);

                        ctx.fillStyle = "black";

                        // Draw boundaries
                        this.drawLine(start_x1, start_y1, end_x1, end_y1);
                        this.drawLine(start_x2, start_y2, end_x2, end_y2);
                        break;
                    }
                default:
                    console.log("SADNESS INSIDE OF VIEW: " + type);
            }

        });
    }



    getLineFromTwoPoints(x1, y1, x2, y2) {
        const a = (y2 - y1) / (x2 - x1);
        const b = y1 - a * x1;
        return [a, b];
    }

    getLineIntersectionPoint(a1, b1, a2, b2) {
        // Bail out in case a1=a2 so as to not divide by 0
        if (a2 - a1 === 0) { window.alert("Don't use the same slope!"); return[0, 0]; }

        const x = (b1 - b2) / (a2 - a1);
        const y = a1 * x + b1;

        return [x, y];
    }

    getLineCoords(p_x, p_y) {
        const start_x = -(this.state.width / 2);
        const start_y = start_x * p_x + p_y;
        const end_x = (this.state.width / 2);
        const end_y = end_x * p_x + p_y;

        return [start_x, start_y, end_x, end_y];
    }

    drawLine(start_x, start_y, end_x, end_y) {
        const ctx = this.state.canvasCtx;
        ctx.beginPath();
        ctx.strokeWidth = 2;
        ctx.moveTo(start_x, start_y);
        ctx.lineTo(end_x, end_y);
        ctx.stroke();
    }

    drawPoint(x, y) {
        const ctx = this.state.canvasCtx;
        ctx.fillRect(x - 2, y - 2, 5, 5);
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

import {useState, useRef, useEffect} from 'react'
import './canvas.css'

const Canvas = ({model, colorMap}) => {
    const [canvasRef] = useState(useRef(null));

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let requestID;

        const loop = () => {
            let nextFrame = ctx.createImageData(canvas.width, canvas.height);
            for(let index = 0; index<model.matrix.length; index++) {
                let i = index * 4;
                let [red, green, blue] = colorMap.get(model.getTeam(index));
                nextFrame.data[i] = red;
                nextFrame.data[i+1] = green;
                nextFrame.data[i+2] = blue;
                nextFrame.data[i+3] = 255;
            }
            ctx.putImageData(nextFrame, 0, 0);
            requestID = requestAnimationFrame(loop);
        };

        loop();

        return () => {
            cancelAnimationFrame(requestID);
        }
    }, [canvasRef, model, colorMap])

    // eslint-disable-next-line
    const getCanvas = () => {
        return canvasRef.current;
    }

    // eslint-disable-next-line
    const getContext = () => {
        return canvasRef.current.getContext('2d');
    }

    const getMousePos = (evt) => {
        var rect = canvasRef.current.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
    }

    const mouseDown = (e) => {
        let point = getMousePos(e);
        model.put('A', point.x, point.y);
    }

    const mouseUp = () => {
    }
    
    return (
        <div className='canvasWrap'>
            <canvas ref={canvasRef} onMouseDown={mouseDown} onMouseUp={mouseUp} width={model.width} height={model.height}></canvas>
        </div>
    )
}

export default Canvas

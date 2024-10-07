// import { useState } from "react";
import Draggable from "react-draggable";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";


const Overlay: React.FC<{ 
    id: string,
    type: string,
    content: string,
    position?: { 
        x: number,
        y: number 
    },
    width: number,
    height: number,
    isSelected: boolean,
    onClick: () => void,
    // onPositionChange: (id: number, position: { x: number; y: number }) => void; 
    onDrag: (e: any, data: any) => void,
    onResize: (e: any, data: any) => void;
}> = ({ type, content, position, width, height, isSelected, onClick, onDrag, onResize }) => {

// const [width, setWidth] = useState(100);
// const [height, setHeight] = useState(50);

return (
    <Draggable 
    bounds="parent"
    position={position} // Controlled position
    onDrag={onDrag} >
        <Resizable
                width={width}
                height={height}
                onResize={onResize}
                resizeHandles={["se"]} // Resize handle on the bottom-right corner
            >
            <div
                onClick={onClick}
                style={{
                width,
                height,
                border: isSelected ? "2px solid red" : "2px solid #ccc",
                backgroundColor: type === "text" ? "yellow" : "transparent",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                pointerEvents: "auto",
                }}
            >
                {type === "text" ? (
                    content
                ) : (
                    <img src={content} alt="overlay" style={{ width: "100%", height: "100%" }} />
                )}
            </div>
        </Resizable>
    </Draggable>
    );
};

export default Overlay
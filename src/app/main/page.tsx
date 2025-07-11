'use client'
import Form from 'next/Form';
import { useState, useEffect } from 'react';

export default function Main() {
    return (
        <>
            <h1>this is main content.</h1>
            <DraggableEntryForm></DraggableEntryForm>
        </>
    )
}

function DraggableEntryForm() {
    const [position, setPosition] = useState({ x: 0, y: 100 });
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                setPosition((prev) => ({
                    x: prev.x + e.movementX,
                    y: prev.y + e.movementY,
                }));
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging]);

    const handleMouseDown = () => {
        setIsDragging(true);
    };

    return (
        <div
            style={{
                position: 'absolute',
                left: position.x,
                top: position.y,
                border: '2px solid white',
                borderRadius: '4px',
                padding: '10px',
                cursor: 'move',
            }}
            onMouseDown={handleMouseDown}
        >
            <h2>Add Theorem</h2>
            <form action="">
                <div>
                    <label>theorem name</label>
                    <input name="theoremName" />
                </div>
                <div>
                    <label>dependencies</label>
                    <input name="dependency" />
                </div>
                <button type="submit">Add</button>
            </form>
        </div>
    );
}

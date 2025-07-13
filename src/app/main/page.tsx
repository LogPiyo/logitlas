'use client';

import { useState, useEffect } from 'react';
import { Theorem, mockData } from '../mock';
import { sortTheorem } from '../utils/topologicalSort';
import EntryForm from '../components/EntryForm';
import Element from '../components/Element';

export default function Main() {
    const [positions, setPositions] = useState<{ [key: number]: { x: number; y: number } }>({});
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);
    const [isPanning, setIsPanning] = useState(false);
    const [startMouse, setStartMouse] = useState({ x: 0, y: 0 });

    const updatePosition = (id: number, pos: { x: number; y: number }) => {
        setPositions((prev) => ({ ...prev, [id]: pos }));
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsPanning(true);
        setStartMouse({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isPanning) {
            const dx = e.clientX - startMouse.x;
            const dy = e.clientY - startMouse.y;
            setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
            setStartMouse({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseUp = () => {
        setIsPanning(false);
    };

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const delta = -e.deltaY * 0.001;
        setScale((prev) => Math.min(Math.max(0.2, prev + delta), 3));
    };

    const handleReset = () => {
        setOffset({ x: 0, y: 0 });
        setScale(1);
    };

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isPanning, startMouse]);

    const sortedOrder = sortTheorem(mockData);

    return (
        <>
            <EntryForm />
            <button
                onClick={handleReset}
                style={{
                    position: 'fixed',
                    top: 10,
                    left: 10,
                    zIndex: 3000,
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#fff',
                    color: '#000',
                    cursor: 'pointer',
                }}
            >
                Reset View
            </button>
            <div
                onMouseDown={handleMouseDown}
                onWheel={handleWheel}
                style={{
                    width: '100vw',
                    height: '100vh',
                    overflow: 'hidden',
                    position: 'relative',
                    backgroundColor: '#111',
                    cursor: isPanning ? 'grabbing' : 'grab',
                }}
            >
                <div
                    style={{
                        transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                        transformOrigin: '0 0',
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                    }}
                >
                    {sortedOrder.map((id, index) => {
                        const theorem = mockData.find((t) => t.theoremId === id);
                        if (!theorem) return null;

                        const initialX = 100 + index * 200;
                        const initialY = index % 2 === 0 ? 100 : 250;

                        return (
                            <Element
                                key={theorem.theoremId}
                                {...theorem}
                                initialX={initialX}
                                initialY={initialY}
                                onPositionChange={updatePosition}
                            />
                        );
                    })}

                    <svg style={{ width: '10000px', height: '10000px', overflow: 'visible' }}>
                        <defs>
                            <marker
                                id="arrowhead"
                                markerWidth="10"
                                markerHeight="7"
                                refX="0"
                                refY="3.5"
                                orient="auto"
                            >
                                <polygon points="0 0, 10 3.5, 0 7" fill="green" />
                            </marker>
                        </defs>
                        {mockData.flatMap((theorem) =>
                            theorem.dependencies.map((depId) => {
                                const from = positions[depId];
                                const to = positions[theorem.theoremId];
                                if (!from || !to) return null;

                                const dx = to.x - from.x;
                                const dy = to.y - from.y;
                                const length = Math.sqrt(dx * dx + dy * dy);
                                if (length === 0) return null;

                                const midX = (from.x + to.x) / 2;
                                const midY = (from.y + to.y) / 2;
                                const arrowLength = 20;
                                const ux = dx / length;
                                const uy = dy / length;
                                const arrowStart = {
                                    x: midX - ux * arrowLength,
                                    y: midY - uy * arrowLength,
                                };

                                return (
                                    <g key={`${theorem.theoremId}-${depId}`}>
                                        <line
                                            x1={from.x}
                                            y1={from.y}
                                            x2={to.x}
                                            y2={to.y}
                                            stroke="green"
                                            strokeWidth="2"
                                        />
                                        <line
                                            x1={arrowStart.x}
                                            y1={arrowStart.y}
                                            x2={midX}
                                            y2={midY}
                                            stroke="green"
                                            strokeWidth="2"
                                            markerEnd="url(#arrowhead)"
                                        />
                                    </g>
                                );
                            })
                        )}
                    </svg>
                </div>
            </div>
        </>
    );
}
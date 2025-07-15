'use client';

import { useState, useEffect } from 'react';
import { sortTheorem } from '../utils/topologicalSort';
import EntryForm from '../components/EntryForm';
import Element from '../components/Element';
import ResetViewButton from '../components/ResetViewButton';

export default function Main() {
    const [positions, setPositions] = useState<{ [key: number]: { x: number; y: number } }>({});
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);
    const [isPanning, setIsPanning] = useState(false);
    const [startMouse, setStartMouse] = useState({ x: 0, y: 0 });
    const [add, setAdd] = useState(false);
    const [theorems, setTheorems] = useState<Theorem[]>([]);

    const jsonFilePath = '/testData.json';

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(jsonFilePath, { cache: 'no-cache' });
                const data = await response.json();
                setTheorems(data);

                setPositions((prev) => {
                const updated = { ...prev };
                data.forEach((t: Theorem, index: number) => {
                    if (!(t.theoremId in updated)) {
                    updated[t.theoremId] = {
                        x: 100 + index * 200,
                        y: index % 2 === 0 ? 100 : 250,
                    };
                    }
                });
                return updated;
                });
            } catch (error) {
                console.error('Error fetching JSON file:', error);
            }
        };

        fetchData();
        console.log('Data fetched from:', jsonFilePath);
        const interval = setInterval(fetchData, 1000);
        return () => clearInterval(interval);
    }, [add]);

    const sortedOrder = sortTheorem(theorems);

    return (
        <>
            <EntryForm onAdd={() => setAdd(prev => !prev)}/>
            <ResetViewButton onClick={handleReset}/>
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
                        const theorem = theorems.find((t) => t.theoremId === id);
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
                        {theorems.flatMap((theorem) =>
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
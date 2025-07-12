'use client';

import { useState, useEffect } from 'react';
import { Theorem, mockData } from '../mock';

export default function Main() {
  const [positions, setPositions] = useState<{ [key: number]: { x: number; y: number } }>({});

  const updatePosition = (id: number, pos: { x: number; y: number }) => {
    setPositions((prev) => ({ ...prev, [id]: pos }));
  };

  return (
    <>
    <EntryForm />
    <div>
      {mockData.map((theorem) => (
        <Element
          key={theorem.theoremId}
          {...theorem}
          onPositionChange={updatePosition}
        />
      ))}

      {mockData.flatMap((theorem) =>
        theorem.dependencies.map((depId) => {
          const from = positions[depId];
          const to = positions[theorem.theoremId];
          return from && to ? (
            <Arrow
              key={`${theorem.theoremId}-${depId}`}
              from={from}
              to={to}
            />
          ) : null;
        })
      )}
    </div>
  </>
  );
}

function Element({
  theoremId,
  theoremName,
  dependencies,
  onPositionChange,
}: {
  theoremId: number;
  theoremName: string;
  dependencies: number[];
  onPositionChange: (id: number, pos: { x: number; y: number }) => void;
}) {
  const [position, setPosition] = useState({ x: 100 + theoremId * 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition((prev) => {
          const newPos = { x: prev.x + e.movementX, y: prev.y + e.movementY };
          onPositionChange(theoremId, getCenter(newPos));
          return newPos;
        });
      }
    };

    const handleMouseUp = () => setIsDragging(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    onPositionChange(theoremId, getCenter(position));
  }, [position]);

  const handleMouseDown = () => setIsDragging(true);

  const width = 150;
  const height = 80;

  const getCenter = (pos: { x: number; y: number }) => ({
    x: pos.x + width / 2,
    y: pos.y + height / 2,
  });

  return (
    <div
      id={`element-${theoremId}`}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width,
        height,
        border: '2px solid white',
        borderRadius: '8px',
        padding: '8px',
        backgroundColor: 'black',
        color: 'white',
        cursor: 'move',
        userSelect: 'none',
        zIndex: 1000,
      }}
      onMouseDown={handleMouseDown}
    >
      <h3>{theoremName}</h3>
      <p>
        {dependencies.length === 0
          ? 'Axiom'
          : `Depends on: ${dependencies.join(', ')}`}
      </p>
    </div>
  );
}

function Arrow({
    from,
    to,
  }: {
    from: { x: number; y: number };
    to: { x: number; y: number };
  }) {
    const arrowColor = "green";
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    if (length === 0) return null;
  
    // 線の中央点
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
  
    // 矢印を中央に表示するために、線はfrom→toに伸ばしつつ、
    // 矢印マーカー付きの短い線を中央にだけ描画する形で実装
    const arrowLength = 20;
    const ux = dx / length;
    const uy = dy / length;
  
    const arrowStart = {
      x: midX - ux * arrowLength,
      y: midY - uy * arrowLength,
    };
  
    return (
      <svg
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
        }}
      >
        {/* 全体の線 */}
        <line
          x1={from.x}
          y1={from.y}
          x2={to.x}
          y2={to.y}
          stroke={arrowColor}
          strokeWidth="2"
        />
        {/* 矢印だけ中央付近に表示 */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="0"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill={arrowColor} />
          </marker>
        </defs>
        <line
          x1={arrowStart.x}
          y1={arrowStart.y}
          x2={midX}
          y2={midY}
          stroke={arrowColor}
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
        />
      </svg>
    );
  }
  
  function EntryForm() {
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
                backgroundColor: 'black',
                zIndex: 2000,
            }}
            onMouseDown={handleMouseDown}
        >
            <h2>Add Theorem</h2>
            <form action="">
                <div>
                    <label>theorem name</label><br/>
                    <input name="theoremName" />
                </div>
                <div>
                    <label>dependencies</label><br/>
                    <input name="dependency" />
                </div>
                <button type="submit">Add</button>
            </form>
        </div>
    );
}
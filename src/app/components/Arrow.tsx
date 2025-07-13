export default function Arrow({
    from,
    to,
}: {
    from: { x: number; y: number };
    to: { x: number; y: number };
}) {
    const arrowColor = 'green';
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
        <svg style={{ overflow: 'visible' }}>
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
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={arrowColor}
                strokeWidth="2"
            />
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
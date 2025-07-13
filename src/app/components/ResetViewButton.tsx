export default function ResetViewButton({onClick}: { onClick: () => void }) {
    return (
        <button
            onClick={onClick}
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
    );
}
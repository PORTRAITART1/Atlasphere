/**
 * Displays the Pi Network validation key as plain black text on white background.
 * No layout, no styling framework, just the raw key visible on screen.
 */
const VALIDATION_KEY = "107cc949f35cbbe6c66f3b459845578443d0cecdbb564f68235fec33fff5d5c5fc5c053e76805bc9b9269437d3a0e22d86145be144db9c4e44afc3b4804350a7";

export default function ValidationKey() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      background: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <pre style={{
        margin: 0,
        padding: 0,
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#000000',
        wordBreak: 'break-all',
        whiteSpace: 'pre-wrap',
      }}>
        {VALIDATION_KEY}
      </pre>
    </div>
  );
}
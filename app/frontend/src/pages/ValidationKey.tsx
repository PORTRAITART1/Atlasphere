/**
 * Displays the Pi Network validation key as plain black text on white background.
 * No layout, no styling framework, just the raw key visible on screen.
 */
const VALIDATION_KEY = "INVALID-PI-VALIDATION-KEY";

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
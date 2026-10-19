/**
 * Displays the Pi Network validation key as plain black text on white background.
 * No layout, no styling framework, just the raw key visible on screen.
 */
const VALIDATION_KEY = "25dc632ee73613220f39faf97edfeda5f8b28f161a03f4bdf45db3a8de3ab6ba92a603053fbdb14118c47bc514d4a6755e1e8c0f1920871a528e9cd9c3bba7ab";

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
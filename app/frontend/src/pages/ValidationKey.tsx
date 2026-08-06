import { useEffect } from 'react';

/**
 * This page serves the Pi Network validation key as plain text.
 * It replaces the entire document with just the key text,
 * ensuring Pi Network's validator sees only the raw key.
 */
const VALIDATION_KEY = "107cc949f35cbbe6c66f3b459845578443d0cecdbb564f68235fec33fff5d5c5fc5c053e76805bc9b9269437d3a0e22d86145be144db9c4e44afc3b4804350a7";

export default function ValidationKey() {
  useEffect(() => {
    // Replace the entire document with plain text
    document.open('text/plain');
    document.write(VALIDATION_KEY);
    document.close();
  }, []);

  // Return null since we're replacing the entire document
  return null;
}
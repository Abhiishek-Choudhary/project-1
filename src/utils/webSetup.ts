import { Platform } from 'react-native';

/** One-time web document styles for full-height app shell. */
export function setupWebDocument(): void {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;
  if (document.getElementById('freshdash-web-shell')) return;

  const style = document.createElement('style');
  style.id = 'freshdash-web-shell';
  style.textContent = `
    html, body { height: 100%; margin: 0; }
    body { background-color: #f8f9fb; overflow-x: hidden; }
    #root { display: flex; flex-direction: column; min-height: 100%; width: 100%; }
  `;
  document.head.appendChild(style);
}

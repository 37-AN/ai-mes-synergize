import * as BufferPolyfill from "buffer";
const { Buffer } = BufferPolyfill;
if (!window.Buffer) {
  window.Buffer = Buffer;
}

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);

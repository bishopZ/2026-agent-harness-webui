import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DocReader } from './routes/DocReader.js';

/**
 * Priority workspace placeholder — filled in by Task 9.
 * No <input>, <select>, or <textarea> here either.
 */
function PriorityWorkspacePlaceholder() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>Agent Harness Web UI</h1>
      <p>Priority workspace — coming in Task 9</p>
      <p>
        <a href="/doc">Open Doc Reader →</a>
      </p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PriorityWorkspacePlaceholder />} />
        <Route path="/doc" element={<DocReader />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

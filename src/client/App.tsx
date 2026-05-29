import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DocReader } from './routes/DocReader.js';
import { PriorityWorkspace } from './routes/PriorityWorkspace.js';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PriorityWorkspace />} />
        <Route path="/doc" element={<DocReader />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

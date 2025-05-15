import React, { useState } from 'react';

interface GeminiKeyModalProps {
  apiKey: string;
  setApiKey: (key: string) => void;
}

const GeminiKeyModal: React.FC<GeminiKeyModalProps> = ({ apiKey, setApiKey }) => {
  // Always call hooks at the top level
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(apiKey);

  // Hide modal and button if API key is already set and cannot be changed
  if (apiKey) return null;

  const handleSave = () => {
    setApiKey(input);
    setOpen(false);
  };

  return (
    <div>
      <button onClick={() => setOpen(true)} style={{ position: 'absolute', top: 16, right: 16 }}>
        {apiKey ? 'API Key Set' : 'Set Gemini API Key'}
      </button>
      {open && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: 24, borderRadius: 8, maxWidth: 400, margin: '10vh auto', position: 'relative' }}>
            <h2>Enter Gemini API Key</h2>
            <input
              type="password"
              value={input}
              onChange={e => setInput(e.target.value)}
              style={{ width: '100%', marginBottom: 16 }}
              placeholder="Paste your Gemini API key here"
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={() => setOpen(false)}>Cancel</button>
              <button onClick={handleSave} disabled={!input}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeminiKeyModal;

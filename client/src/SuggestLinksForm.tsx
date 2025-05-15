import React, { useState } from 'react';

interface SuggestLinksFormProps {
  onSuggest: (params: { keywords: string; category: string; count: number; file?: File | null }) => void;
  loading: boolean;
}

const SuggestLinksForm: React.FC<SuggestLinksFormProps> = ({ onSuggest, loading }) => {
  const [keywords, setKeywords] = useState('');
  const categoriesList = [
    'Any Category',
    'Learning',
    'Tools',
    'Project Repos',
    'Videos'
  ];
  const [category, setCategory] = useState('Any Category');
  const [count, setCount] = useState(5);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuggest({ keywords, category, count, file });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <label>
        Keywords (optional):
        <input value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="e.g. react, machine learning" />
      </label>
      <label>
        Category (optional):
        <select value={category} onChange={e => setCategory(e.target.value)}>
          {categoriesList.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </label>
      <label>
        Number of Links to Suggest: {count}
        <input type="range" min={1} max={20} value={count} onChange={e => setCount(Number(e.target.value))} />
      </label>
      <label>
        Upload Existing Links (optional):
        <input type="file" accept=".txt,.csv,.json,.xlsx" onChange={e => setFile(e.target.files?.[0] || null)} />
      </label>
      <button type="submit" disabled={loading}>{loading ? 'Suggesting...' : 'Suggest Links'}</button>
    </form>
  );
};

export default SuggestLinksForm;

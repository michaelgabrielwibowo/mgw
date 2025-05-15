import React, { useState } from 'react';
import GeminiKeyModal from './GeminiKeyModal';
import SuggestLinksForm from './SuggestLinksForm';
import './App.css';

function App() {
  // Embed the Gemini API key directly
  const [apiKey] = useState('AIzaSyDU8BCUxtbl8ub4hLagme93zLZTos3X6OY');
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState<any[]>([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('last');

  const filterCategories = [
    'All Categories',
    'Learning',
    'Tools',
    'Project Repos',
    'Videos',
    'AI Generated'
  ];

  const handleSuggest = async ({ keywords, category, count, file }: any) => {
    setLoading(true);
    // Simulate Gemini API response with mock data
    setTimeout(() => {
      setLinks([
        ...links,
        ...[
          {
            url: 'https://godotengine.org',
            title: 'Godot Engine',
            description: 'Godot Engine is a feature-rich, cross-platform game engine to create 2D and 3D games from a unified interface. Fully open source and free to use.',
            category: 'Tools',
            ai: true,
            added: Date.now(),
          },
          {
            url: 'https://github.com/awesomedata/awesome-public-datasets',
            title: 'Awesome Public Datasets',
            description: 'A collection of awesome public datasets. A valuable resource for data science and machine learning projects.',
            category: 'AI Generated',
            ai: true,
            added: Date.now(),
          },
          {
            url: 'https://drawio.com',
            title: 'Draw.io',
            description: 'Draw.io is a free online diagramming tool that you can use for everything from basic flowcharts to complex UML diagrams. Fully open source.',
            category: 'Tools',
            ai: true,
            added: Date.now(),
          },
          {
            url: 'https://learngitbranching.js.org',
            title: 'Learn Git Branching',
            description: 'A free interactive tutorial to learn Git. Covers basic to advanced Git concepts with exercises.',
            category: 'Learning',
            ai: true,
            added: Date.now(),
          },
          {
            url: 'https://github.com/EbookFoundation/free-programming-books',
            title: 'Free Programming Books',
            description: 'A curated list of free programming books. Covers a wide range of programming languages and topics.',
            category: 'Learning',
            ai: true,
            added: Date.now(),
          },
        ].slice(0, count)
      ]);
      setLoading(false);
    }, 1000);
  };

  const filteredLinks = links.filter(l => !filterCategory || l.category === filterCategory);
  const sortedLinks = [...filteredLinks].sort((a, b) => {
    switch (sortBy) {
      case 'title-asc':
        return a.title.localeCompare(b.title);
      case 'title-desc':
        return b.title.localeCompare(a.title);
      case 'category':
        return a.category.localeCompare(b.category);
      case 'first':
        return a.added - b.added;
      case 'last':
      default:
        return b.added - a.added;
    }
  });

  const handleExport = () => {
    const csv = 'Title,URL,Category\n' + links.map(l => `${l.title},${l.url},${l.category}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'links.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const categories = Array.from(new Set(links.map(l => l.category)));

  return (
    <div className="App">
      <GeminiKeyModal apiKey={apiKey} setApiKey={() => {}} />
      <div style={{ display: 'flex', gap: 32, padding: 32 }}>
        <div style={{ minWidth: 320, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <h2>AI Link Suggestions</h2>
            <SuggestLinksForm onSuggest={handleSuggest} loading={loading} />
          </div>
          <div>
            <h3>Filter & Sort Links</h3>
            <div style={{ marginBottom: 8 }}>
              <label>Filter by Category: </label>
              <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                {filterCategories.map(cat => (
                  <option key={cat} value={cat === 'All Categories' ? '' : cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Sort By: </label>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
                <option value="category">Category</option>
                <option value="last">Last Added</option>
                <option value="first">First Added</option>
              </select>
            </div>
          </div>
          <div>
            <h3>Export Data</h3>
            <button onClick={handleExport}>Export Links</button>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <h2>Link Collection</h2>
          <div style={{ color: '#666', fontSize: 14, marginBottom: 8 }}>
            Displaying {sortedLinks.length} of {links.length} total links.
          </div>
          {sortedLinks.length === 0 ? (
            <div style={{ color: '#888', marginTop: 32 }}>No links found.<br/>Try adjusting your filters or suggesting new links!</div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
              {sortedLinks.map((l, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: 24, minWidth: 300, maxWidth: 340, flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 22 }}>💡</span>
                    {l.ai && <span style={{ fontSize: 13, color: '#009fd4', border: '1px solid #009fd4', borderRadius: 12, padding: '2px 10px', marginLeft: 4, display: 'flex', alignItems: 'center', gap: 4 }}>🤖 AI</span>}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 18 }}>{l.title}</div>
                  <div style={{ color: '#444', fontSize: 15 }}>{l.description}</div>
                  <div style={{ flex: 1 }} />
                  <a href={l.url} target="_blank" rel="noopener noreferrer" style={{ marginTop: 8, background: '#f7f7f7', border: 'none', borderRadius: 6, padding: '8px 0', fontWeight: 500, textAlign: 'center', textDecoration: 'none', color: '#222', display: 'block' }}>Visit Link <span style={{ fontSize: 13 }}>↗</span></a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

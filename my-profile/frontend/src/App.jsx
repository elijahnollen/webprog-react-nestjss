import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const STICKER_ASSETS = [
  '/img/star.png',
  '/img/thinking.png',
  '/img/surprised.png',
  '/img/lol.png',
  '/img/in-love.png',
  '/img/dizzy.png'
];

function App() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [entries, setEntries] = useState([]);

  // Use relative path for Vercel, fallback to localhost for Eli's dev environment
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      // Endpoint is just /guestbook because VITE_API_URL handles the /api prefix
      const response = await axios.get(`${API_URL}/guestbook`);
      setEntries(response.data);
    } catch (err) {
      console.error("Error fetching guestbook:", err);
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!formData.name) return alert("Please enter your name!");

    try {
      const payload = { 
        name: formData.name, 
        email: formData.email, 
        message: formData.message, 
        sticker_url: selectedSticker 
      };

      // Removed extra '/api' from the string below
      const response = await axios.post(`${API_URL}/guestbook`, payload);

      if (response.status === 201 || response.status === 200) {
        setFormData({ name: '', email: '', message: '' });
        setSelectedSticker(null);
        fetchEntries(); 
      }
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Submission failed. Check the console for details!");
    }
  };

  return (
    <div className="doodle-app-container">
      <h1 className="doodle-title">Leave a little trace of yourself!</h1>

      <div className="guestbook-main-flex">
        {/* SIGNING BOX */}
        <div className="doodle-card form-box">
          <h2 className="doodle-label">Sign the Guestbook</h2>
          <form onSubmit={submitForm}>
            <input 
              type="text" 
              placeholder="Your Name" 
              className="doodle-input-field"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <input 
              type="email" 
              placeholder="Your Email (optional)" 
              className="doodle-input-field"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <div className="doodle-textarea-wrapper">
              <textarea 
                placeholder="Say something (optional)" 
                className="doodle-textarea-field"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              ></textarea>
              <div className="sticker-drop-preview">
                {selectedSticker ? (
                  <img src={selectedSticker} alt="preview" />
                ) : (
                  <span className="drop-text">Sticker here</span>
                )}
              </div>
            </div>
            <button type="submit" className="doodle-submit-btn">SUBMIT</button>
          </form>
        </div>

        {/* STICKER BOX - Fixed "Sakto" on the right */}
        <div className="doodle-card sticker-box">
          <h2 className="doodle-label">Sticker Box</h2>
          <div className="sticker-selection-grid">
            {STICKER_ASSETS.map((src) => (
              <div 
                key={src} 
                className={`sticker-item-doodle ${selectedSticker === src ? 'active' : ''}`}
                onClick={() => setSelectedSticker(src)}
              >
                <img src={src} alt="option" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="traces-feed-section">
        <h3 className="feed-header-title">Recent Traces</h3>
        <div className="feed-container-list">
          {entries.length > 0 ? entries.map((entry) => (
            <div key={entry.id} className="entry-doodle-bubble">
              <div className="entry-content-left">
                <span className="entry-user-identity">
                  {entry.name} {entry.email ? <span className="entry-user-email">({entry.email})</span> : ''}
                </span>
                <p className="entry-user-message">
                  {entry.message ? entry.message : 'Hi!'}
                </p>
              </div>
              <div className="entry-sticker-right">
                {entry.sticker_url && <img src={entry.sticker_url} alt="user sticker" />}
              </div>
            </div>
          )) : <p>No traces yet. Be the first!</p>}
        </div>
      </section>
    </div>
  );
}

export default App;
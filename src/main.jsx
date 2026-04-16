import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
// Logo glow listener
document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href="/"], a[href="/app/dashboard"]');
    if (!link) return;
    const line = link.querySelector(".logo-line");
    if (!line) return;
    line.classList.remove("glow");
    void line.offsetWidth;
    line.classList.add("glow");
    setTimeout(() => line.classList.remove("glow"), 600);
  });
});

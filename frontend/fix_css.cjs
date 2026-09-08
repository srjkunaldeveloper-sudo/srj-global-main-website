const fs = require('fs');

const path = 'd:/srj_website/updated_srj_website/src/styles/Pricing.css';
const lines = fs.readFileSync(path, 'utf8').split('\n');

// Find the index of the last closing brace before my appended section
let targetLine = 1026;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('LUXURY REDESIGN')) {
    targetLine = i - 1;
    break;
  }
}

// Slice out any duplicate luxury design content appended previously
const cleanLines = lines.slice(0, targetLine);

const newCss = `
/* ==========================================================================
   LUXURY REDESIGN (Black & White Minimal + Electric Blue)
   ========================================================================== */
.luxury-addons-section {
  position: relative;
  background-color: #FFFFFF !important;
  padding: 100px 5%;
  overflow: hidden;
}

.luxury-section-bg-gradient {
  position: absolute;
  top: 0; left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.05), transparent 60%),
    linear-gradient(to right, rgba(0,0,0,0.02) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0,0,0,0.02) 1px, transparent 1px);
  background-size: 100% 100%, 40px 40px, 40px 40px;
  pointer-events: none;
  z-index: 0;
}

.luxury-section-header {
  position: relative;
  z-index: 1;
  text-align: center;
  margin-bottom: 80px;
}

.luxury-pill {
  display: inline-block;
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 100px;
  padding: 6px 16px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #0A0A0A;
  margin-bottom: 20px;
}

.luxury-heading {
  font-size: 64px;
  font-weight: 800;
  color: #0A0A0A;
  margin: 0 0 16px 0;
  letter-spacing: -0.02em;
}

.luxury-subtitle {
  font-size: 18px;
  color: #6B7280;
  max-width: 600px;
  margin: 0 auto;
}

.luxury-addon-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  max-width: 1400px;
  margin: 0 auto;
}

.luxury-addon-card {
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 22px;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.luxury-addon-card:hover {
  transform: translateY(-8px);
  border-color: #111;
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.08);
  background: #FFFFFF;
}

.luxury-addon-left {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
}

.luxury-addon-icon-container {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: #F6F7F9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #111;
  flex-shrink: 0;
  transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.luxury-addon-card:hover .luxury-addon-icon-container {
  background: #000000;
  color: #FFFFFF;
}

.luxury-addon-content {
  display: flex;
  flex-direction: column;
}

.luxury-addon-title {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.3;
  color: #0A0A0A;
  margin: 0 0 4px 0;
}

.luxury-addon-desc {
  font-size: 14px;
  color: #6B7280;
  margin: 0 0 8px 0;
}

.luxury-addon-price {
  font-size: 18px;
  font-weight: 700;
  color: #3B82F6;
  margin: 0;
}

.luxury-addon-card:hover .luxury-addon-price {
  transform: scale(1.05);
  transform-origin: left;
}

.luxury-toggle {
  width: 44px;
  height: 24px;
  border-radius: 24px;
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  position: relative;
  transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.luxury-toggle-handle {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  background: #E5E7EB;
  border-radius: 50%;
  transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.luxury-addon-card.selected .luxury-toggle {
  background: #3B82F6;
  border-color: #3B82F6;
}

.luxury-addon-card.selected .luxury-toggle-handle {
  background: #FFFFFF;
  transform: translateX(20px);
}

.luxury-summary-section {
  background-color: #FFFFFF !important;
  padding: 60px 5%;
}

.luxury-premium-container {
  background: #FFFFFF;
  border-radius: 32px;
  padding: 48px;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.06);
  border: 1px solid #E5E7EB;
  max-width: 1200px;
  margin: 0 auto;
}

.luxury-section-title {
  font-size: 22px;
  font-weight: 700;
  color: #0A0A0A;
  margin-bottom: 32px;
}

.luxury-timeline-wrapper {
  margin-bottom: 60px;
}

.luxury-timeline-container {
  position: relative;
  padding: 20px 0;
}

.luxury-progress-line-bg {
  position: absolute;
  top: 30px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #E5E7EB;
  z-index: 1;
}

.luxury-progress-line-active {
  position: absolute;
  top: 30px;
  left: 0;
  height: 2px;
  background: #3B82F6;
  z-index: 2;
  transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.luxury-timeline-nodes {
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 3;
}

.luxury-timeline-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  width: 80px;
}

.node-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #FFFFFF;
  border: 2px solid #E5E7EB;
  margin-bottom: 16px;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.node-label {
  font-size: 14px;
  color: #6B7280;
  font-weight: 500;
  transition: all 0.3s;
}

.luxury-timeline-node.past .node-circle {
  background: #3B82F6;
  border-color: #3B82F6;
}

.luxury-timeline-node.selected .node-circle {
  background: #3B82F6;
  border-color: #FFFFFF;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);
  transform: scale(1.2);
  animation: pulse-glow 2s infinite;
}

@keyframes pulse-glow {
  0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
  100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
}

.luxury-timeline-node.selected .node-label {
  color: #0A0A0A;
  font-weight: 700;
}

.luxury-summary-grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 48px;
}

.luxury-invoice-list {
  display: flex;
  flex-direction: column;
}

.luxury-invoice-row {
  display: flex;
  justify-content: space-between;
  padding: 20px 16px;
  border-bottom: 1px solid rgba(0,0,0,0.04);
  font-size: 16px;
  color: #0A0A0A;
  transition: background 0.3s;
}

.luxury-invoice-row:hover {
  background: #FAFAFA;
}

.luxury-invoice-row span.amount {
  font-weight: 600;
}

.luxury-invoice-row.rush-delivery {
  color: #3B82F6;
}
.luxury-invoice-row.rush-delivery span.amount {
  color: #3B82F6;
}

.luxury-invoice-row.total-row {
  border-bottom: none;
  border-top: 1px solid #E5E7EB;
  margin-top: 10px;
  font-weight: 800;
  font-size: 20px;
}

.luxury-estimate-card {
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 15px 50px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  position: relative;
}

.luxury-estimate-badge {
  display: inline-block;
  background: #0A0A0A;
  color: #FFFFFF;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 100px;
  align-self: flex-start;
  margin-bottom: 24px;
}

.luxury-estimate-label {
  font-size: 14px;
  color: #6B7280;
  margin-bottom: 8px;
}

.luxury-final-price {
  font-size: 48px;
  font-weight: 800;
  color: #0A0A0A;
  margin-bottom: 32px;
  line-height: 1;
}

.luxury-features-list {
  list-style: none;
  padding: 0;
  margin: 0 0 32px 0;
  display: flex;
  justify-content: space-between;
}

.luxury-features-list li {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
  color: #6B7280;
  gap: 8px;
  text-align: center;
}
.luxury-features-list li svg {
  font-size: 20px;
  color: #0A0A0A;
}

.luxury-cta-btn {
  background: #0A0A0A;
  color: #FFFFFF;
  border: none;
  padding: 18px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  width: 100%;
}

.luxury-cta-btn:hover {
  background: #3B82F6;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
}

.luxury-cta-btn .arrow-icon {
  transition: transform 0.4s;
}

.luxury-cta-btn:hover .arrow-icon {
  transform: translateX(6px);
}

@media (max-width: 1200px) {
  .luxury-addon-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 768px) {
  .luxury-heading {
    font-size: 42px;
  }
  .luxury-addon-grid {
    grid-template-columns: 1fr;
  }
  .luxury-summary-grid {
    grid-template-columns: 1fr;
  }
}
`;

fs.writeFileSync(path, cleanLines.join('\n') + '\n' + newCss);

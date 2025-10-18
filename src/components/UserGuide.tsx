import React from 'react';

const UserGuide: React.FC = () => {
  return (
    <div className="user-guide">
      <h1>User Guide</h1>
      <hr />

      <div className="guide-content">
        <section className="guide-section">
          <h2>Welcome to the Financial Dashboard</h2>
          <p>This comprehensive financial dashboard provides real-time insights into your healthcare organization's financial performance.</p>
        </section>

        <section className="guide-section">
          <h2>Navigation</h2>
          <div className="guide-item">
            <h3>📊 Dashboard</h3>
            <p>Overview of key financial metrics, revenue breakdown, and expense analysis with animated charts.</p>
          </div>

          <div className="guide-item">
            <h3>📋 Income Statement</h3>
            <p>Traditional income statement view with detailed revenue and expense categories.</p>
          </div>

          <div className="guide-item">
            <h3>📈 Trended IS</h3>
            <p>Multi-period income statement analysis showing financial trends over time.</p>
          </div>

          <div className="guide-item">
            <h3>⚖️ Balance Sheet</h3>
            <p>Assets, liabilities, and equity position of your organization.</p>
          </div>

          <div className="guide-item">
            <h3>🧪 Test Trend</h3>
            <p>Advanced financial analysis with interactive ratio calculations and drill-down capabilities.</p>
          </div>

          <div className="guide-item">
            <h3>⚙️ Settings</h3>
            <p>Customize your dashboard preferences and configuration options.</p>
          </div>

          <div className="guide-item">
            <h3>🤖 Ask AI</h3>
            <p>Interactive AI assistant for financial questions and analysis support.</p>
          </div>
        </section>

        <section className="guide-section">
          <h2>Features</h2>

          <div className="guide-item">
            <h3>Interactive Charts</h3>
            <p>Click and hover over charts for detailed information and tooltips.</p>
          </div>

          <div className="guide-item">
            <h3>Financial Ratios</h3>
            <p>Click on ratio percentages in the Test Trend section to see detailed calculations.</p>
          </div>

          <div className="guide-item">
            <h3>Data Export</h3>
            <p>Export financial data to Excel for further analysis and reporting.</p>
          </div>

          <div className="guide-item">
            <h3>Real-time Updates</h3>
            <p>Dashboard data refreshes automatically to provide current financial insights.</p>
          </div>
        </section>

        <section className="guide-section">
          <h2>Getting Started</h2>
          <ol className="guide-steps">
            <li>Start with the <strong>Dashboard</strong> for a high-level overview</li>
            <li>Use <strong>Trended IS</strong> for detailed period-over-period analysis</li>
            <li>Explore <strong>Test Trend</strong> for advanced ratio analysis</li>
            <li>Try the <strong>Ask AI</strong> feature for specific questions</li>
            <li>Customize settings to match your preferences</li>
          </ol>
        </section>

        <section className="guide-section">
          <h2>Support</h2>
          <p>For additional support or questions about the financial dashboard:</p>
          <ul className="support-list">
            <li>📧 Contact: support@arkitech.com</li>
            <li>📞 Phone: (555) 123-4567</li>
            <li>🌐 Documentation: www.arkitech.com/docs</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default UserGuide;
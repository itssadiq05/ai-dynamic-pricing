import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import DemandForecast from './pages/DemandForecast';
import PriceRecommendation from './pages/PriceRecommendation';
import SalesAnalytics from './pages/SalesAnalytics';
import Inventory from './pages/Inventory';
import Transactions from './pages/Transactions';
import MLModel from './pages/MLModel';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-slate-950 text-slate-100">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/forecast" element={<DemandForecast />} />
              <Route path="/pricing" element={<PriceRecommendation />} />
              <Route path="/analytics" element={<SalesAnalytics />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/ml-model" element={<MLModel />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;


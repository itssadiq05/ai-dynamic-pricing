import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

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

const App = () => {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-black text-[#f5f5f7]">

        {/* Sidebar */}
        <Sidebar />

        {/* Main Area */}
        <div className="flex-1 min-w-0 flex flex-col bg-black">

          {/* Header */}
          <Header />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-black">
            <Routes>

              <Route
                path="/"
                element={<Dashboard />}
              />

              <Route
                path="/products"
                element={<Products />}
              />

              <Route
                path="/forecast"
                element={<DemandForecast />}
              />

              <Route
                path="/pricing"
                element={<PriceRecommendation />}
              />

              <Route
                path="/analytics"
                element={<SalesAnalytics />}
              />

              <Route
                path="/inventory"
                element={<Inventory />}
              />

              <Route
                path="/transactions"
                element={<Transactions />}
              />

              <Route
                path="/ml-model"
                element={<MLModel />}
              />

            </Routes>
          </main>

        </div>

      </div>
    </BrowserRouter>
  );
};

export default App;
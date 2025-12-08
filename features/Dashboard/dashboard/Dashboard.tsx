"use client"
import React, { useState } from 'react';
import Sidebar from "@/components/sidebar/Sidebar"
import Header from '@/components/header/Header';
import MetricCard from '@/components/cards/Metriccard';
import YearlyTarget from '@/components/cards/Yearlytarget';
import YearlyAnalysis from '@/components/cards/YearlyAnalysis';
import ProductivityCard from '@/components/cards/Productivity';
import ProductTable from '@/components/tables/Producttable';
import { metrics, products } from '../constants/Static';

const Dashboard: React.FC = () => {
  const [activeNav, setActiveNav] = useState('Dashboard');
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />
      <div className="flex-1 ml-64">
        <Header />
        <div className="p-8">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-sm">Dashboard</p>
          </div>

          {/* Yearly Target */}
          <div className="mb-6">
            <YearlyTarget 
              totalCost="$231,032,444"
              targetValue="$500,000,00"
              percentage={46}
            />
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {metrics.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>

          {/* Yearly Analysis and Productivity Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <YearlyAnalysis />
            </div>
            <ProductivityCard 
              title="Increase your productivity"
              description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"
            />
          </div>

          {/* Product Popular Table */}
          <ProductTable products={products} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
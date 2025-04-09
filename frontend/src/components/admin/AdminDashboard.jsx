import React, { useState, useEffect } from 'react';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title,
  LineElement,
  PointElement
} from 'chart.js';
import axios from 'axios';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  LineElement,
  PointElement
);

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    categories: null,
    customers: null,
    sales: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all stats in parallel
        const [categoriesRes, customersRes, salesRes] = await Promise.all([
          axios.get('/stats/categories'),
          axios.get('/stats/customers'),
          axios.get('/stats/sales'),

        ]);

        setStats({
          categories: categoriesRes.data,
          customers: customersRes.data,
          sales: salesRes.data,
        });
        
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchData();
  }, []);

  // Chart data configurations
  const categoryChartData = {
    labels: stats.categories?.map(item => item.categoryName) || [],
    datasets: [{
      data: stats.categories?.map(item => item.orderCount) || [],
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40'
      ],
      borderWidth: 1,
    }],
  };

  const customerChartData = {
    labels: stats.customers?.months || [],
    datasets: [
      {
        label: 'New Customers',
        data: stats.customers?.new || [],
        backgroundColor: '#36A2EB',
      },
      {
        label: 'Returning Customers',
        data: stats.customers?.returning || [],
        backgroundColor: '#FFCE56',
      },
    ],
  };

  const salesChartData = {
    labels: stats.sales?.months || [],
    datasets: [
      {
        label: 'Total Sales ($)',
        data: stats.sales?.sales || [],
        borderColor: '#4BC0C0',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
        yAxisID: 'y',
      },
      {
        label: 'Number of Orders',
        data: stats.sales?.orders || [],
        borderColor: '#FF6384',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.1,
        yAxisID: 'y1',
      }
    ],
  };

  const customerChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Customer Acquisition (Last 6 Months)',
      },
    },
  };

  const salesChartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      title: {
        display: true,
        text: 'Sales Performance (Last 6 Months)',
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Total Sales ($)'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Number of Orders'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-message">
          Error loading dashboard data: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <h1>Dashboard Overview</h1>
      
      <div className="chart-row">
        <div className="chart-card">
          <div className="card-header">
            <h3>Top Product Categories</h3>
          </div>
          <div className="card-body">
            {stats.categories ? (
              <div className="chart-container">
                <Doughnut 
                  data={categoryChartData} 
                  options={{
                    plugins: {
                      legend: {
                        position: 'right',
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} orders (${percentage}%)`;
                          }
                        }
                      }
                    },
                    maintainAspectRatio: false
                  }}
                />
              </div>
            ) : (
              <p>No category data available</p>
            )}
          </div>
        </div>
        
        <div className="chart-card">
          <div className="card-header">
            <h3>Customer Statistics</h3>
          </div>
          <div className="card-body">
            {stats.customers ? (
              <div className="chart-container">
                <Bar 
                  data={customerChartData} 
                  options={{
                    ...customerChartOptions,
                    maintainAspectRatio: false
                  }} 
                />
              </div>
            ) : (
              <p>No customer data available</p>
            )}
          </div>
        </div>
      </div>

      <div className="full-width-chart">
        <div className="chart-card">
          <div className="card-header">
            <h3>Sales Performance</h3>
          </div>
          <div className="card-body">
            {stats.sales ? (
              <div className="chart-container">
                <Line 
                  data={salesChartData} 
                  options={{
                    ...salesChartOptions,
                    maintainAspectRatio: false
                  }} 
                />
              </div>
            ) : (
              <p>No sales data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
      <div className="summary-card primary">
          <h4>Total Categories</h4>
          <h2>{stats.totalCategoriesCount || 0}</h2>
        </div>
        <div className="summary-card primary">
          <h4>Top Selling Categories</h4>
          <h2>{stats.categories?.length || 0}</h2>
        </div>
        <div className="summary-card success">
          <h4>Total Customers (6 months)</h4>
          <h2>
            {stats.customers ? 
              stats.customers.new.reduce((a, b) => a + b, 0) + 
              stats.customers.returning.reduce((a, b) => a + b, 0) 
              : 0}
          </h2>
        </div>
        <div className="summary-card info">
          <h4>Total Sales (6 months)</h4>
          <h2>${stats.sales?.sales.reduce((a, b) => a + b, 0).toLocaleString() || 0}</h2>
        </div>
      </div>

      <style jsx>{`
        .admin-dashboard {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        h1 {
          margin-bottom: 20px;
          color: #333;
        }
        
        .dashboard-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 300px;
        }
        
        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top: 4px solid #3498db;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .dashboard-error {
          padding: 20px;
          background-color: #f8d7da;
          color: #721c24;
          border-radius: 4px;
          margin: 20px 0;
        }
        
        .chart-row {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .chart-card {
          flex: 1 1 calc(50% - 20px);
          min-width: 300px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .full-width-chart {
          margin-bottom: 20px;
        }
        
        .card-header {
          padding: 15px 20px;
          border-bottom: 1px solid #eee;
        }
        
        .card-header h3 {
          margin: 0;
          font-size: 18px;
          color: #444;
        }
        
        .card-body {
          padding: 20px;
        }
        
        .chart-container {
          position: relative;
          height: 300px;
          width: 100%;
        }
        
        .summary-cards {
          display: flex;
          gap: 20px;
          margin-top: 20px;
          flex-wrap: wrap;
        }
        
        .summary-card {
          flex: 1 1 calc(33.333% - 20px);
          min-width: 200px;
          padding: 20px;
          border-radius: 8px;
          color: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .summary-card h4 {
          margin: 0 0 10px 0;
          font-size: 16px;
          opacity: 0.9;
        }
        
        .summary-card h2 {
          margin: 0;
          font-size: 28px;
        }
        
        .primary {
          background: linear-gradient(135deg, #4e73df 0%, #224abe 100%);
        }
        
        .success {
          background: linear-gradient(135deg, #1cc88a 0%, #13855c 100%);
        }
        
        .info {
          background: linear-gradient(135deg, #36b9cc 0%, #258391 100%);
        }
        
        @media (max-width: 768px) {
          .chart-card,
          .summary-card {
            flex: 1 1 100%;
          }
        }
      `}</style>
    </div>
  );
};
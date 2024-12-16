import React, { useState, useEffect, useCallback } from "react";
import { Box, Card, CardContent, CardHeader, Grid, Typography, TextField, MenuItem, CircularProgress, Backdrop, Button } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment';
import DatePicker from "react-datepicker";
import { useNavigate } from 'react-router-dom';
import SupplierPerformanceCard from '../component/SupplierPerformanceCard';
import { getCostHighlights, getPriceTrend } from '../services/api';
import { useSelector } from 'react-redux';

import "react-datepicker/dist/react-datepicker.css"; // Import the styles for React Datepicker
import './DashboardPage.css'; // Import custom CSS for responsiveness

const DashboardPage = () => {
  const navigate = useNavigate();

  const [highlightsDateRange, setHighlightsDateRange] = useState([null, null]);
  const [costHighlights, setCostHighlights] = useState({ total_savings: 0, percentage_savings: "--" });
  const [trendDateRange, setTrendDateRange] = useState([null, null]);
  const [priceTrend, setPriceTrend] = useState([]);
  const [interval, setInterval] = useState("daily");
  const [loading, setLoading] = useState(false);
  const { role, token, mobileNumber, userName } = useSelector((state) => state.auth);

  const fetchCostHighlights = useCallback(async () => {
    if (highlightsDateRange[0] && highlightsDateRange[1]) {
      setLoading(true);
      const [startDate, endDate] = highlightsDateRange.map(date => moment(date).format('DD-MM-YYYY'));
      try {
        const highlightsData = await getCostHighlights(startDate, endDate, token, role);
        if (highlightsData[0]?.percentage_savings) {
          highlightsData[0].percentage_savings = parseFloat(highlightsData[0].percentage_savings).toFixed(2);
        }
        setCostHighlights(highlightsData[0] || { total_savings: 0, percentage_savings: "--" });
      } catch (error) {
        console.error("Failed to fetch cost highlights", error);
      }
      setLoading(false);
    }
  }, [highlightsDateRange]);

  const fetchPriceTrend = useCallback(async () => {
    if (trendDateRange[0] && trendDateRange[1]) {
      setLoading(true);
      const [startDate, endDate] = trendDateRange.map(date => moment(date).format('DD-MM-YYYY'));
      try {
        const trendData = await getPriceTrend(startDate, endDate, interval, token, role);
        const formattedData = trendData.trend.map(item => ({
          ...item,
          time_period: moment(item.time_period).format(interval === "daily" ? "DD MMM YYYY" : "MMM YYYY")
        }));
        setPriceTrend(formattedData);
      } catch (error) {
        console.error("Failed to fetch price trend", error);
      }
      setLoading(false);
    }
  }, [trendDateRange, interval]);

  useEffect(() => {
    fetchCostHighlights();
  }, [highlightsDateRange, fetchCostHighlights]);

  useEffect(() => {
    fetchPriceTrend();
  }, [trendDateRange, interval, fetchPriceTrend]);

  return (
    <Box p={2} sx={{ overflowY: 'auto', height: '100vh', background: '#f5f5f5' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Order Analysis Dashboard</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/manager-dashboard')}
        >
          Back To Dashboard
        </Button>
      </Box>

      {loading && (
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}

      <Grid container spacing={2}>
        {/* Cost Analysis Highlights */}
        <Grid item xs={12}>
          <Card sx={{ padding: 2 }}>
            <Typography variant="h4" mb={2}>Cost Analysis Highlights</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <DatePicker
                  selected={highlightsDateRange[0]}
                  onChange={(dates) => setHighlightsDateRange(dates)}
                  startDate={highlightsDateRange[0]}
                  endDate={highlightsDateRange[1]}
                  selectsRange
                  isClearable
                  dateFormat="yyyy-MM-dd"
                  className="custom-datepicker"
                  placeholderText="Select Date Range"
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} mt={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6">Total Savings</Typography>
                <Typography variant="h4" color="success.main">
                  {costHighlights.total_savings}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6">Percentage Savings</Typography>
                <Typography variant="h4" color="error.main">
                  {costHighlights.percentage_savings}%
                </Typography>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {/* Price Trend Analysis */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Price Trend Analysis" />
            <CardContent>
              <Grid container spacing={2} mb={2}>
                <Grid item xs={12} md={8}>
                  <DatePicker
                    selected={trendDateRange[0]}
                    onChange={(dates) => setTrendDateRange(dates)}
                    startDate={trendDateRange[0]}
                    endDate={trendDateRange[1]}
                    selectsRange
                    isClearable
                    dateFormat="yyyy-MM-dd"
                    className="custom-datepicker"
                    placeholderText="Select Date Range"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Interval"
                    select
                    value={interval}
                    onChange={(e) => setInterval(e.target.value)}
                    fullWidth
                  >
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={priceTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time_period" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="average_expected_price" stroke="#8884d8" name="Expected Price" />
                  <Line type="monotone" dataKey="average_ordered_price" stroke="#82ca9d" name="Ordered Price" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Supplier Performance Card */}
        <Grid item xs={12}>
          <SupplierPerformanceCard />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;

import React, { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, Statistic } from "antd";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import DatePicker from "react-datepicker";
import { getSupplierPerformance } from "../services/api";
import { useSelector } from 'react-redux';
import "react-datepicker/dist/react-datepicker.css"; // Import the styles for React Datepicker
import '../pages/DashboardPage.css'; // Custom styles for better responsiveness

const SupplierPerformanceCard = () => {
  const [supplierDateRange, setSupplierDateRange] = useState([null, null]);
  const { role, token } = useSelector((state) => state.auth);

  // Initialize supplierData with empty arrays to avoid undefined errors
  const [supplierData, setSupplierData] = useState({
    average_orders_by_supplier: [],
    average_delivery_time_by_supplier: [],
  });

  // Function to format date in DD-MM-YYYY format
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Fetch Supplier Performance Data
  const fetchSupplierPerformance = useCallback(async () => {
    // Only fetch data if both startDate and endDate are valid
    if (supplierDateRange[0] && supplierDateRange[1]) {
      const [startDate, endDate] = supplierDateRange.map((date) =>
        date ? formatDate(date) : ''
      );

      try {
        const supplierPerformanceData = await getSupplierPerformance(
          startDate,
          endDate,
          token, 
          role
        );

        // Ensure the data arrays are never undefined, even if the API returns empty results
        setSupplierData({
          average_orders_by_supplier: supplierPerformanceData.average_orders_by_supplier || [],
          average_delivery_time_by_supplier: supplierPerformanceData.average_delivery_time_by_supplier || [],
        });
      } catch (error) {
        console.error("Failed to fetch supplier performance data", error);
      }
    }
  }, [supplierDateRange, token, role]); // Only include supplierDateRange
  
  useEffect(() => {
    fetchSupplierPerformance();
  }, [fetchSupplierPerformance]);

  // Calculate Total Orders Delivered
  const totalOrdersDelivered = supplierData.average_orders_by_supplier?.reduce((sum, supplier) => sum + supplier.total_orders, 0) || 0;

  // Calculate Average Delivery Days
  const averageDeliveryDays = (
    supplierData.average_delivery_time_by_supplier?.reduce((sum, supplier) => sum + parseFloat(supplier.avg_delivery_days), 0) / 
    (supplierData.average_delivery_time_by_supplier?.length || 1) // Avoid division by zero
  ) || 0;

  return (
    <Card title="Supplier Performance" style={{ marginTop: "20px" }}>
      <Row gutter={16} style={{ marginBottom: "20px" }}>
        <Col span={24}>
          <DatePicker
            selected={supplierDateRange[0]}
            onChange={(dates) => setSupplierDateRange(dates)}
            startDate={supplierDateRange[0]}
            endDate={supplierDateRange[1]}
            selectsRange
            isClearable
            dateFormat="dd-MM-yyyy"  // Set the date format to DD-MM-YYYY
            className="custom-datepicker"
            placeholderText="Select Date Range"
          />
        </Col>
      </Row>

      {/* Bar Chart for Average Orders by Supplier */}
      <Row gutter={16}>
        <Col span={24}>
          <h3>Average Orders Delivered by Supplier</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={supplierData.average_orders_by_supplier}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="supplier_name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total_orders" fill="#82ca9d" name="Total Orders Delivered" />
            </BarChart>
          </ResponsiveContainer>
        </Col>
      </Row>

      {/* Horizontal Line Divider */}
      <hr style={{ margin: "20px 0" }} />

      {/* Bar Chart for Average Delivery Time by Supplier */}
      <Row gutter={16}>
        <Col span={24}>
          <h3>Average Delivery Time by Supplier</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={supplierData.average_delivery_time_by_supplier}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="supplier_name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="avg_delivery_days" fill="#8884d8" name="Average Delivery Time (Days)" />
            </BarChart>
          </ResponsiveContainer>
        </Col>
      </Row>

      {/* Additional Data Below the Graphs */}
      <Row gutter={16} style={{ marginTop: "20px" }}>
        <Col span={8}>
          <Statistic
            title="Total Orders Delivered"
            value={totalOrdersDelivered}
            suffix="orders"
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="Average Delivery Days"
            value={averageDeliveryDays.toFixed(2)}
            suffix="days"
          />
        </Col>
      </Row>
    </Card>
  );
};

export default SupplierPerformanceCard;

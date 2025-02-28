import React, { useEffect, useState } from "react";
import { Layout, Card, Statistic, Table } from "antd";
import { DollarCircleOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import axios from "axios";
import SellerSidebar from "../../../components/seller/SellerSidebar";
import SellerNavbar from "../../../components/seller/SellerNavbar";

const { Content, Header } = Layout;

const SellerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ totalSales: 0, totalOrders: 0 });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("sellerToken");
        const { data } = await axios.get("http://localhost:5000/api/seller/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStats({ totalSales: data.totalSales, totalOrders: data.totalOrders });
        setOrders(data.recentOrders);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };

    fetchDashboardData();
  }, []);

  const columns = [
    { title: "Order ID", dataIndex: "orderId", key: "orderId" },
    { title: "Customer", dataIndex: "customer", key: "customer" },
    { title: "Total Price", dataIndex: "total", key: "total", render: (text) => `$${text}` },
    { title: "Status", dataIndex: "status", key: "status" },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <SellerSidebar />

      <Layout>
        {/* Navbar */}
        <Header style={{ background: "#fff", padding: 0, boxShadow: "0px 2px 5px rgba(0,0,0,0.1)" }}>
          <SellerNavbar />
        </Header>

        {/* Content */}
        <Content style={{ padding: "20px" }}>
          <h2>Seller Dashboard</h2>

          {/* Stats Cards */}
          <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
            <Card>
              <Statistic title="Total Sales" value={stats.totalSales} prefix={<DollarCircleOutlined />} />
            </Card>
            <Card>
              <Statistic title="Total Orders" value={stats.totalOrders} prefix={<ShoppingCartOutlined />} />
            </Card>
          </div>

          {/* Recent Orders Table */}
          <Table columns={columns} dataSource={orders} rowKey="orderId" />
        </Content>
      </Layout>
    </Layout>
  );
};

export default SellerDashboard;

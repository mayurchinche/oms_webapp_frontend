// import React, { useState } from "react";
// import OrderTypeHeader from "./OrderTypeHeader";
// import "./OrdersPage.css"; // Link to the CSS file

// const OrdersPage = () => {
//   const [orderType, setOrderType] = useState("Forward");

//   const handleOrderTypeChange = (type) => {
//     setOrderType(type);
//     console.log(`Fetching data for ${type} orders...`);
//     // Add logic to fetch data based on the order type
//   };

//   return (
//     <div className="orders-page">
//       {/* Header for switching order types */}
//       <OrderTypeHeader onOrderTypeChange={handleOrderTypeChange} />

//       {/* Section for orders table */}
//       <div className="orders-table">
//         <h2>{orderType} Orders</h2>
//         <table>
//           <thead>
//             <tr>
//               <th>Order ID</th>
//               <th>Order Date</th>
//               <th>Approval Date</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {/* Sample rows - Replace with dynamic data */}
//             <tr>
//               <td>1001</td>
//               <td>2024-12-01</td>
//               <td>2024-12-02</td>
//               <td>Approved</td>
//             </tr>
//             <tr>
//               <td>1002</td>
//               <td>2024-12-03</td>
//               <td>2024-12-04</td>
//               <td>Pending</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default OrdersPage;

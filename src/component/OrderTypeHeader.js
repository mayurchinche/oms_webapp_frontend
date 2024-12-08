// import React, { useState } from "react";
// import "./OrderTypeHeader.css"; // Link to the CSS file

// const OrderTypeHeader = ({ onOrderTypeChange }) => {
//   const [orderType, setOrderType] = useState("Forward");

//   const handleToggle = (type) => {
//     setOrderType(type);
//     onOrderTypeChange(type); // Notify parent component about the change
//   };

//   return (
//     <div className="order-type-header">
//       {/* Forward Orders Button */}
//       <button
//         className={`toggle-button ${orderType === "Forward" ? "active" : ""}`}
//         onClick={() => handleToggle("Forward")}
//       >
//         Forward Orders
//       </button>
//       {/* Reversal Orders Button */}
//       <button
//         className={`toggle-button ${orderType === "Reversal" ? "active" : ""}`}
//         onClick={() => handleToggle("Reversal")}
//       >
//         Reversal Orders
//       </button>
//     </div>
//   );
// };

// export default OrderTypeHeader;

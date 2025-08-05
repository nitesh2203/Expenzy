import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { motion } from "framer-motion"; // For animations

const Budget = () => {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Define categories with associated images
  const categories = [
    { 
      label: "Under ₹30,000", 
      value: "<30K", 
      img: "https://th.bing.com/th/id/R.12ddff49fcfe7959ad98341b60c789d3?rik=XJDKl6cQttk9LA&pid=ImgRaw&r=0", 
      description: "Budget-conscious lifestyle focusing on essential expenses."
    },
    { 
      label: "₹30,000 - ₹50,000", 
      value: "30K-50K", 
      img: "https://th.bing.com/th/id/OIP.KAP4QYMrNU7bhqdMnFYUHgHaE8?rs=1&pid=ImgDetMain", 
      description: "Middle-class living with some flexibility for lifestyle choices."
    },
    { 
      label: "₹50,000 - ₹1,00,000", 
      value: "50K-1L", 
      img: "https://th.bing.com/th/id/OIP.OURUiENjbMOIcj153C9IAgHaEK?rs=1&pid=ImgDetMain", 
      description: "Comfortable lifestyle with better access to entertainment and savings."
    },
    { 
      label: "Above ₹1,00,000", 
      value: ">1L", 
      img: "https://wallpaperaccess.com/full/2058684.jpg", 
      description: "Luxury living with a focus on high-end amenities and investments."
    },
  ];

  const handleOpen = (category) => {
    setSelectedCategory(category);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <div style={{
      position: "relative", // Position relative to enable pseudo-element
      padding: "50px", 
      minHeight: "100vh", 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center",
      flexDirection: "column",
      color: "white",  // Text color should stand out against the background
    }}>
      {/* Background Image with Blur (pseudo-element for background) */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "url('https://th.bing.com/th/id/OIP.MDDwzgq_zWxNAhA4svyymQHaEo?rs=1&pid=ImgDetMain') no-repeat center center fixed", // Updated image URL
        backgroundSize: "cover", // Ensure image covers the entire screen
        backgroundPosition: "center center", // Center the image
        filter: "blur(8px)", // Apply blur only to the background
        zIndex: -1, // Make sure it's behind the content
        height: "100vh", // Stretch the background to fill the entire viewport height
      }}></div>

      <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
        {/* Centered Title (Only one title now) */}
        <h2 style={{
          textAlign: "center", 
          fontFamily: "'Arial', sans-serif", 
          fontWeight: "bold", 
          marginBottom: "40px", 
          fontSize: "36px",
          zIndex: 2,
          position: "relative"
        }}>
          Income Categories
        </h2>

        {/* Category Cards */}
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            >
              <Card
                onClick={() => handleOpen(category.label)}
                style={{
                  width: "250px",
                  height: "350px",
                  padding: "20px",
                  cursor: "pointer",
                  textAlign: "center",
                  borderRadius: "15px",
                  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  willChange: "transform",
                  position: "relative",
                  margin: "10px",
                  background: "linear-gradient(135deg, #2c3e50, #34495e)", // Grey and Black gradient for cards
                  color: "#fff",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "scale(1.05)";
                  e.target.style.boxShadow = "0 12px 30px rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "scale(1)";
                  e.target.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.1)";
                }}
              >
                {/* Image inside the card */}
                <img 
                  src={category.img} 
                  alt={category.label} 
                  style={{
                    width: "100%", 
                    height: "150px", 
                    objectFit: "cover", 
                    borderRadius: "8px", 
                    marginBottom: "15px",
                  }} 
                />
                <CardContent>
                  <h3 style={{ fontSize: "18px", color: "#fff", fontWeight: "bold" }}>
                    {category.label}
                  </h3>

                  {/* New Two-line Description */}
                  <p style={{
                    fontSize: "14px", 
                    color: "#ddd", 
                    marginTop: "10px", 
                    lineHeight: "1.4", // To give some space between lines
                    maxHeight: "40px", // Limit to 2 lines
                    overflow: "hidden", // Hide overflow if text is more than 2 lines
                    textOverflow: "ellipsis", // Show ellipsis when text overflows
                  }}>
                    {category.description || "This is a placeholder description for the selected category."}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Dialog for category details */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle style={{ backgroundColor: "#f4f4f4", color: "#333" }}>Category Details</DialogTitle>
          <DialogContent>
            <p style={{ color: "#666" }}>
              You have selected the <strong>{selectedCategory}</strong> category.
            </p>

            {/* Calculate budget distribution based on category */}
            {selectedCategory && (() => {
              let income = 0;
              if (selectedCategory === "Under ₹30,000") income = 30000;
              else if (selectedCategory === "₹30,000 - ₹50,000") income = 50000;
              else if (selectedCategory === "₹50,000 - ₹1,00,000") income = 100000;
              else if (selectedCategory === "Above ₹1,00,000") income = 150000;

              const needs = income * 0.5;
              const wants = income * 0.3;
              const savings = income * 0.2;

              return (
                <div>
                  <p><strong>Budget Breakdown (50-30-20 Rule):</strong></p>

                  {/* Needs Breakdown */}
                  <p><strong>Needs (50%): ₹{needs.toLocaleString()}</strong></p>
                  <ul style={{ marginLeft: "15px", color: "#444" }}>
                    <li>Rent & Housing: ₹{(needs * 0.4).toLocaleString()}</li>
                    <li>Groceries & Food: ₹{(needs * 0.3).toLocaleString()}</li>
                    <li>Transportation: ₹{(needs * 0.15).toLocaleString()}</li>
                    <li>Utilities (Electricity, Internet, etc.): ₹{(needs * 0.1).toLocaleString()}</li>
                    <li>Healthcare & Insurance: ₹{(needs * 0.05).toLocaleString()}</li>
                  </ul>

                  {/* Wants Breakdown */}
                  <p><strong>Wants (30%): ₹{wants.toLocaleString()}</strong></p>
                  <ul style={{ marginLeft: "15px", color: "#444" }}>
                    <li>Entertainment & Subscriptions: ₹{(wants * 0.4).toLocaleString()}</li>
                    <li>Shopping & Dining Out: ₹{(wants * 0.4).toLocaleString()}</li>
                    <li>Travel & Leisure: ₹{(wants * 0.2).toLocaleString()}</li>
                  </ul>

                  {/* Savings Breakdown */}
                  <p><strong>Savings (20%): ₹{savings.toLocaleString()}</strong></p>
                  <ul style={{ marginLeft: "15px", color: "#444" }}>
                    <li>Investments (Stocks, Mutual Funds): ₹{(savings * 0.5).toLocaleString()}</li>
                    <li>Emergency Fund: ₹{(savings * 0.3).toLocaleString()}</li>
                    <li>Other Long-term Goals: ₹{(savings * 0.2).toLocaleString()}</li>
                  </ul>
                </div>
              );
            })()}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary" style={{ backgroundColor: "#00796b", color: "#fff" }}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Budget;
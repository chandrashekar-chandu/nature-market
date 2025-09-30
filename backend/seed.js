const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const products = [
  // Vegetables
  { name: "Fresh Tomatoes", price: 40, image: "/src/assets/veg1.jpg", category: "vegetables", description: "Organic red tomatoes" },
  { name: "Green Lettuce", price: 25, image: "/src/assets/veg2.jpg", category: "vegetables", description: "Crisp green lettuce" },
  { name: "Carrots", price: 30, image: "/src/assets/veg3.jpg", category: "vegetables", description: "Fresh orange carrots" },

  // Dairy
  { name: "Fresh Milk", price: 60, image: "/src/assets/d1.jpg", category: "dairy", description: "Pure cow milk" },
  { name: "Cheese Block", price: 120, image: "/src/assets/d2.jpg", category: "dairy", description: "Cheddar cheese" },
  { name: "Butter", price: 80, image: "/src/assets/d3.jpg", category: "dairy", description: "Fresh butter" },

  // Ice Cream
  { name: "Vanilla Ice Cream", price: 150, image: "/src/assets/ice1.jpg", category: "icecream", description: "Creamy vanilla flavor" },
  { name: "Chocolate Ice Cream", price: 160, image: "/src/assets/ice2.jpg", category: "icecream", description: "Rich chocolate flavor" },
  { name: "Strawberry Ice Cream", price: 155, image: "/src/assets/ice3.jpg", category: "icecream", description: "Fresh strawberry flavor" },

  // General Products
  { name: "Organic Honey", price: 200, image: "/src/assets/pic1.jpg", category: "general", description: "Pure organic honey" },
  { name: "Green Tea", price: 180, image: "/src/assets/pic2.jpg", category: "general", description: "Premium green tea" },
  { name: "Herbal Oil", price: 250, image: "/src/assets/pic3.jpg", category: "general", description: "Natural herbal oil" },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('Database seeded successfully');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
// BeelStep WhatsApp Bot
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// Admin number
const ADMIN_NUMBER = "+923065909583";

// Sample product data
const products = [
  { name: "Nike Air", price: 8000, category: "Shoes" },
  { name: "Adidas Run", price: 7000, category: "Shoes" },
  { name: "Bata Casual", price: 3500, category: "Shoes" },
  { name: "Polo Shirt", price: 2500, category: "Clothes" }
];

// Urdu/English language flags
let userLang = {};

app.post("/whatsapp", (req, res) => {
  const from = req.body.From?.replace("whatsapp:", "") || "unknown";
  const msg = req.body.Body?.trim().toLowerCase() || "";
  let reply = "";

  console.log("📩 Message received from:", from, "Message:", msg);

  // Trigger command
  if (msg === "./beelstep") {
    reply = `👋 Welcome to *BeelStep Store!*
Please choose an option:
1️⃣ Product Categories  
2️⃣ Search Product  
3️⃣ Place Order  
4️⃣ Check Order Status  
5️⃣ Generate Invoice  
6️⃣ Language Settings`;
  }

  // Language menu
  else if (msg === "6") {
    userLang[from] = "pending";
    reply = `Select language:
1️⃣ English  
2️⃣ اردو`;
  } else if (msg === "1" && userLang[from] === "urdu") {
    reply = "🛍 جوتے، کپڑے، یا ایکسیسریز منتخب کریں۔";
  } else if (msg === "2" && userLang[from] === "urdu") {
    reply = "🔍 براہ کرم مصنوعہ کا نام لکھیں۔";
  } else if (msg === "1") {
    reply = `🛍 Categories:
1️⃣ Shoes  
2️⃣ Clothes  
3️⃣ Accessories`;
  }

  // Admin panel
  else if (msg === "./admin" && from === ADMIN_NUMBER) {
    reply = `👑 *BeelStep Admin Panel*
1️⃣ View Orders  
2️⃣ Update Order Status  
3️⃣ Add Product  
4️⃣ Delete Product  
5️⃣ Broadcast Message`;
  } else if (msg === "./admin" && from !== ADMIN_NUMBER) {
    reply = "❌ You are not authorized to access admin commands.";
  }

  // Language setting
  else if (msg === "1" && userLang[from] === "pending") {
    userLang[from] = "english";
    reply = "✅ Language set to English.";
  } else if (msg === "2" && userLang[from] === "pending") {
    userLang[from] = "urdu";
    reply = "✅ زبان اردو پر سیٹ کر دی گئی ہے۔";
  }

  // Default fallback
  else if (!reply) {
    reply = "Type `./beelstep` to open BeelStep menu.";
  }

  // Send TwiML XML response
  res.set("Content-Type", "text/xml");
  res.send(`
    <Response>
      <Message>${reply}</Message>
    </Response>
  `);
});

// ✅ Railway Dynamic Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ BeelStep Bot running on port ${PORT}`));

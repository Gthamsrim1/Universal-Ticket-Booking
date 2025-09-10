# 🎟️ Universal Ticket Booking System (Blue Tag)

<p align="center">
  <b>A unified platform for booking buses, trains, movies, events, and hotels — all in one place.</b><br>
  Built with modern full-stack technologies, 3D UI, and secure payments.
</p>

<p align="center">
  <img width="1919" height="907" alt="image" src="https://github.com/user-attachments/assets/bb16e6e5-17d0-4daf-857a-eacadb1c2b5a" />

</p>

---

## ✨ Features
- 🔎 **Search & Filter** – intuitive search with advanced filtering  
- ⏱️ **Real-Time Availability** – live seat & room updates  
- 💸 **Dynamic Pricing** – adaptive fares based on demand  
- 👤 **User Authentication** – secure login & profile management  
- 📜 **Booking History** – past & upcoming reservations at a glance  
- 🎨 **3D Interactive UI** – immersive experience powered by React Three.js  
- 💳 **Stripe Payments** – secure, seamless ticket purchase flow  
- 🏪 **Vendor Dashboard** – vendors can list and manage events, movies, or shows  
- 🛡️ **Admin Panel** – admins approve/disapprove listings, manage users, and monitor system health  
- 📱 **Responsive UI** – optimized for desktop & mobile
  
---

## 🛠️ Tech Stack
<p align="center">
  <img src="https://skillicons.dev/icons?i=react,nextjs,threejs,tailwind,mongodb,nodejs,express,vercel,stripe&perline=7" />
</p>


---

## 🏗️ Architecture
```mermaid
graph TD;
    User[User] --> UI[Next.js + Tailwind + React Three.js]
    Vendor[Vendor] --> UI
    Admin[Admin] --> UI
    UI --> API[next-api]
    API --> DB[(MongoDB Database)]
    API --> Auth[Authentication & Sessions]
    API --> Stripe[Stripe Payment Gateway]
    DB --> Inventory[Real-time Availability + Pricing]

```

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/ticket-booking.git
cd ticket-booking
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Configure Environment Variables
Create a `.env` file in the root directory:
```env
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=your-stripe-secret
STRIPE_PUBLIC_KEY=your-stripe-public
```

### 4️⃣ Run the App
```bash
npm run dev
```
App will be running at: **http://localhost:3000**

---

## 📸 Screenshots
<p align="center">
  <img width="1898" height="909" alt="image" src="https://github.com/user-attachments/assets/ec69e01c-a63d-4735-bdcd-9fe45c95dea6" />
  <img width="1898" height="904" alt="image" src="https://github.com/user-attachments/assets/49982799-93ba-4eac-99e9-afcf9d439adf" />
  <img width="1889" height="906" alt="image" src="https://github.com/user-attachments/assets/e72fa456-cb57-4d6f-abd3-4c5ea2f8ad13" />
  <img width="1897" height="907" alt="image" src="https://github.com/user-attachments/assets/46bb5918-c6b1-425a-9233-1d88b36c92a0" />


</p>

---

## 📊 Project Highlights
- **Unified System** – one app to handle multiple booking domains  
- **3D Visualizations** – interactive UI powered by React Three.js  
- **Secure Payments** – Stripe integration for real-world checkout  
- **Vendor Management** – vendors can create & manage events  
- **Admin Control** – admins moderate events, movies, users, and transactions  
- **Scalable Backend** – built with Node.js & Express  
- **Cloud-Ready** – deployable on Vercel / AWS / Heroku  
- **Database-Driven** – MongoDB for real-time booking and pricing
  
---

## 🤝 Contributing
Contributions are welcome!  
- Fork the repo  
- Create a feature branch  
- Submit a pull request  

---

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.

---

## 🌐 Connect with Me
<p align="center">
  <a href="https://www.linkedin.com/in/gautham-sriram-bb0b89334/"><img src="https://skillicons.dev/icons?i=linkedin" height="40"/></a>
  <a href="mailto:gauthamsriram16@gmail.com"><img src="https://skillicons.dev/icons?i=gmail" height="40"/></a>
  <a href="https://github.com/Gthamsrim1"><img src="https://skillicons.dev/icons?i=github" height="40"/></a>
</p>

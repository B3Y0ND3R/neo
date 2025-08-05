# NEO - Multi-Brand Clothing Website

A comprehensive e-commerce platform with AI-powered features, real-time chat support, and virtual try-on.

## 🏗️ Project Architecture

### **Frontend (React + Vite)**
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS + Radix UI components
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **Real-time**: Socket.io Client
- **UI Libraries**: Framer Motion, Lucide React, React Spinners

### **Backend (Node.js + Express)**
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js + JWT + Google OAuth
- **File Upload**: Multer + Cloudinary
- **Payment**: PayPal REST SDK
- **Real-time**: Socket.io
- **Email**: SendInBlue API


## 📁 Complete Project Structure

```
neo-up/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/              # Reusable UI Components
│   │   │   ├── ui/                  # Base UI Components (20 files)
│   │   │   │   ├── avatar.jsx       # User avatar component
│   │   │   │   ├── badge.jsx        # Status badges
│   │   │   │   ├── button.jsx       # Button variants
│   │   │   │   ├── card.jsx         # Card layouts
│   │   │   │   ├── checkbox.jsx     # Checkbox inputs
│   │   │   │   ├── dialog.jsx       # Modal dialogs
│   │   │   │   ├── dropdown-menu.jsx # Dropdown menus
│   │   │   │   ├── input.jsx        # Form inputs
│   │   │   │   ├── label.jsx        # Form labels
│   │   │   │   ├── select.jsx       # Select dropdowns
│   │   │   │   ├── separator.jsx    # Visual separators
│   │   │   │   ├── sheet.jsx        # Slide-out panels
│   │   │   │   ├── skeleton.jsx     # Loading skeletons
│   │   │   │   ├── table.jsx        # Data tables
│   │   │   │   ├── tabs.jsx         # Tab navigation
│   │   │   │   ├── textarea.jsx     # Text area inputs
│   │   │   │   ├── toast.jsx        # Toast notifications
│   │   │   │   ├── toaster.jsx      # Toast container
│   │   │   │   └── use-toast.jsx    # Toast hook
│   │   │   ├── admin-view/          # Admin Components (7 files)
│   │   │   │   ├── header.jsx       # Admin header
│   │   │   │   ├── image-upload.jsx # Image upload component
│   │   │   │   ├── layout.jsx       # Admin layout wrapper
│   │   │   │   ├── order-details.jsx # Order detail view
│   │   │   │   ├── orders.jsx       # Orders list component
│   │   │   │   ├── product-tile.jsx # Product display tile
│   │   │   │   └── sidebar.jsx      # Admin navigation sidebar
│   │   │   ├── shopping-view/       # Shopping Components (11 files)
│   │   │   │   ├── address.jsx      # Address management
│   │   │   │   ├── address-card.jsx # Address display card
│   │   │   │   ├── cart-items-content.jsx # Cart items display
│   │   │   │   ├── cart-wrapper.jsx # Cart container
│   │   │   │   ├── filter.jsx       # Product filters
│   │   │   │   ├── header.jsx       # Shopping header
│   │   │   │   ├── layout.jsx       # Shopping layout wrapper
│   │   │   │   ├── order-details.jsx # Order details view
│   │   │   │   ├── orders.jsx       # Orders list
│   │   │   │   ├── product-details.jsx # Product detail view
│   │   │   │   └── product-tile.jsx # Product display tile
│   │   │   ├── home/                # Homepage Components (5 files)
│   │   │   │   ├── footer.jsx       # Site footer
│   │   │   │   ├── header.jsx       # Homepage header
│   │   │   │   ├── layout.jsx       # Homepage layout
│   │   │   │   ├── product-details.jsx # Product details
│   │   │   │   └── product-tile.jsx # Product tiles
│   │   │   ├── auth/                # Authentication Components (1 file)
│   │   │   │   └── layout.jsx       # Auth layout wrapper
│   │   │   ├── chat/                # Chat Components (1 file)
│   │   │   │   └── ChatWindow.jsx   # Chat interface
│   │   │   ├── common/              # Shared Components (3 files)
│   │   │   │   ├── check-auth.jsx   # Authentication checker
│   │   │   │   ├── form.jsx         # Reusable form component
│   │   │   │   └── star-rating.jsx  # Star rating component
│   │   │   ├── shop/                # Shop Components (2 files)
│   │   │   │   ├── review-image-upload.jsx # Review image upload
│   │   │   │   └── star-rating.jsx  # Shop star rating
│   │   │   
│   │   ├── pages/                   # Page Components
│   │   │   ├── admin-view/          # Admin Pages (11 files + 1 subfolder)
│   │   │   │   ├── about-us.jsx     # About us management
│   │   │   │   ├── brands.jsx       # Brand management
│   │   │   │   ├── brands/          # Brand sub-components
│   │   │   │   │   └── add-edit-dialog.jsx # Brand add/edit dialog
│   │   │   │   ├── chats.jsx        # Chat management
│   │   │   │   ├── contact-queries.jsx # Contact queries
│   │   │   │   ├── dashboard.jsx    # Admin dashboard
│   │   │   │   ├── faq.jsx          # FAQ management
│   │   │   │   ├── features.jsx     # Features management
│   │   │   │   ├── filter-manage.jsx # Filter management
│   │   │   │   ├── orders.jsx       # Order management
│   │   │   │   └── products.jsx     # Product management
│   │   │   ├── shopping-view/       # Shopping Pages (9 files)
│   │   │   │   ├── account.jsx      # User account page
│   │   │   │   ├── chat.jsx         # Customer chat page
│   │   │   │   ├── checkout.jsx     # Checkout process
│   │   │   │   ├── home.jsx         # Shopping home page
│   │   │   │   ├── listing.jsx      # Product listings
│   │   │   │   ├── paypal-return.jsx # PayPal return page
│   │   │   │   ├── payment-success.jsx # Payment success page
│   │   │   │   ├── public-home.jsx  # Public home page
│   │   │   │   └── search.jsx       # Product search page
│   │   │   ├── auth/                # Authentication Pages (4 files)
│   │   │   │   ├── forgot-password.jsx # Password recovery
│   │   │   │   ├── login.jsx        # Login page
│   │   │   │   ├── register.jsx     # Registration page
│   │   │   │   └── reset-password.jsx # Password reset
│   │   │   ├── home/                # Public Home Pages (2 files)
│   │   │   │   ├── home.jsx         # Main homepage
│   │   │   │   └── listing.jsx      # Public listings
│   │   │   
│   │   │   ├── not-found/           # Error Pages (1 file)
│   │   │   │   └── index.jsx        # 404 page
│   │   │   ├── unauth-page/         # Unauthorized Pages (1 file)
│   │   │   │   └── index.jsx        # Unauthorized access page
│   │   │   ├── about-us.jsx         # About us page
│   │   │   ├── contact.jsx          # Contact page
│   │   │   ├── faq.jsx              # FAQ page
│   │   │   └── TryOnPage.jsx        # Try-on page
│   │   ├── store/                   # Redux State Management
│   │   │   ├── admin/               # Admin State (4 slices)
│   │   │   │   ├── brands-slice/    # Brand management state
│   │   │   │   │   └── index.js
│   │   │   │   ├── order-slice/     # Order management state
│   │   │   │   │   └── index.js
│   │   │   │   ├── products-slice/  # Product management state
│   │   │   │   │   └── index.js
│   │   │   │   └── review-slice/    # Review management state
│   │   │   │       └── index.js
│   │   │   ├── shop/                # Shopping State (6 slices)
│   │   │   │   ├── adress-slice/    # Address management state
│   │   │   │   │   └── index.js
│   │   │   │   ├── cart-slice/      # Shopping cart state
│   │   │   │   │   └── index.js
│   │   │   │   ├── order-slice/     # Order state
│   │   │   │   │   └── index.js
│   │   │   │   ├── products-slice/  # Product state
│   │   │   │   │   └── index.js
│   │   │   │   ├── review-slice/    # Review state
│   │   │   │   │   └── index.js
│   │   │   │   └── search-slice/    # Search state
│   │   │   │       └── index.js
│   │   │   ├── auth-slice/          # Authentication State (1 slice)
│   │   │   │   └── index.js
│   │   │   ├── common-slice/        # Common State (1 slice)
│   │   │   │   └── index.js
│   │   │   ├── filter-slice/        # Filter State (1 slice)
│   │   │   │   └── index.js
│   │   │   ├── store.js             # Redux store configuration
│   │   │   └── test.js              # Store test file
│   │   ├── hooks/                   # Custom React Hooks (1 file)
│   │   │   └── use-toast.js         # Toast notification hook
│   │   ├── lib/                     # Utility Functions (1 file)
│   │   │   └── utils.js             # Common utilities
│   │   ├── config/                  # Configuration (1 file)
│   │   │   └── index.js             # App configuration
│   │   ├── assets/                  # Static Assets (7 files + 1 subfolder)
│   │   │   ├── img/                 # Images
│   │   │   │   └── neo.png          # Logo
│   │   │   ├── 404.mp4              # 404 video
│   │   │   ├── account.jpg          # Account image
│   │   │   ├── banner-1.webp        # Banner images
│   │   │   ├── banner-2.webp
│   │   │   ├── banner-3.webp
│   │   │   └── react.svg            # React logo
│   │   ├── App.jsx                  # Main application component
│   │   ├── App.css                  # Application styles
│   │   ├── index.css                # Global styles
│   │   └── main.jsx                 # Application entry point
│   ├── public/                      # Public Assets (1 file)
│   │   └── vite.svg                 # Vite logo
│   ├── package.json                 # Frontend dependencies
│   ├── package-lock.json            # Dependency lock file
│   ├── vite.config.js               # Vite configuration
│   ├── tailwind.config.js           # Tailwind CSS configuration
│   ├── postcss.config.js            # PostCSS configuration
│   ├── jsconfig.json                # JavaScript configuration
│   ├── index.html                   # HTML template
│   ├── eslint.config.js             # ESLint configuration
│   ├── components.json              # Component configuration
│   ├── README.md                    # Frontend documentation
│   └── .gitignore                   # Git ignore rules
├── server/                          # Node.js Backend
│   ├── controllers/                 # Business Logic Controllers
│   │   ├── admin/                   # Admin Controllers (3 files)
│   │   │   ├── brands-controller.js # Brand management logic
│   │   │   ├── order-controller.js  # Order management logic
│   │   │   └── products-controller.js # Product management logic
│   │   ├── auth/                    # Authentication Controller (1 file)
│   │   │   └── auth-controller.js   # Authentication logic
│   │   ├── shop/                    # Shop Controllers (6 files)
│   │   │   ├── address-controller.js # Address management logic
│   │   │   ├── cart-controller.js   # Shopping cart logic
│   │   │   ├── order-controller.js  # Order processing logic
│   │   │   ├── product-review-controller.js # Review management logic
│   │   │   ├── products-controller.js # Product logic
│   │   │   └── search-controller.js # Search functionality logic
│   │   ├── common/                  # Common Controller (1 file)
│   │   │   └── feature-controller.js # Feature management logic
│   │   └── filters-controller.js    # Filter management logic
│   ├── models/                      # Database Models (13 files)
│   │   ├── Address.js               # Address data model
│   │   ├── Brand.js                 # Brand data model
│   │   ├── Cart.js                  # Cart data model
│   │   ├── Chat.js                  # Chat data model
│   │   ├── Contact.js               # Contact form model
│   │   ├── Faq.js                   # FAQ data model
│   │   ├── Features.js              # Features data model
│   │   ├── Filter.js                # Filter data model
│   │   ├── Order.js                 # Order data model
│   │   ├── Product.js               # Product data model
│   │   ├── Review.js                # Review data model
│   │   ├── User.js                  # User data model
│   │   └── aboutUs.js               # About us data model
│   ├── routes/                      # API Routes
│   │   ├── admin/                   # Admin Routes (3 files)
│   │   │   ├── brands-routes.js     # Brand management endpoints
│   │   │   ├── order-routes.js      # Order management endpoints
│   │   │   └── products-routes.js   # Product management endpoints
│   │   ├── auth/                    # Authentication Routes (1 file)
│   │   │   └── auth-routes.js       # Authentication endpoints
│   │   ├── shop/                    # Shop Routes (6 files)
│   │   │   ├── address-routes.js    # Address management endpoints
│   │   │   ├── cart-routes.js       # Shopping cart endpoints
│   │   │   ├── order-routes.js      # Order processing endpoints
│   │   │   ├── products-routes.js   # Product endpoints
│   │   │   ├── review-routes.js     # Review endpoints
│   │   │   └── search-routes.js     # Search endpoints
│   │   ├── chat/                    # Chat Routes (1 file)
│   │   │   └── chat-routes.js       # Chat functionality endpoints
│   │   ├── common/                  # Common Routes (1 file)
│   │   │   └── feature-routes.js    # Feature management endpoints
│   │   ├── aboutUs.js               # About us endpoints
│   │   ├── contact.js               # Contact form endpoints
│   │   ├── faq.js                   # FAQ endpoints
│   │   └── filter-routes.js         # Filter endpoints
│   ├── helpers/                     # Utility Helpers (2 files)
│   │   ├── cloudinary.js            # Cloudinary image upload helper
│   │   └── paypal.js                # PayPal payment helper
│   ├── utils/                       # Additional Utilities (3 files)
│   │   ├── emailService.js          # Email service utility
│   │   ├── refund.js                # Refund processing utility
│   │   └── text-vector.js           # Text vectorization utility
│   ├── scripts/                     # Database Scripts (1 file)
│   │   └── generate-vectors.js      # Vector generation script
│   ├── seeder/                      # Database Seeding (2 files)
│   │   ├── brandSeeder.js           # Brand data seeder
│   │   └── seeder.js                # General data seeder
│   ├── config/                      # Configuration (1 file)
│   │   └── passport.js              # Passport authentication config
│   ├── server.js                    # Main server file
│   ├── package.json                 # Backend dependencies
│   ├── package-lock.json            # Dependency lock file
│   └── .gitignore                   # Git ignore rules
└── .git/                            # Git repository
```

## 🚀 Features

### **1. Authentication & Authorization**
- **User Registration/Login**: JWT-based authentication system
- **Google OAuth**: Social login integration with Google
- **Password Reset**: Email-based password recovery system
- **Role-based Access Control**: Admin vs Customer role management
- **Session Management**: Secure session handling with Passport.js
- **Protected Routes**: Authentication guards for sensitive pages

### **2. Admin Dashboard**
- **Dashboard Overview**: Analytics and statistics dashboard
- **Product Management**: Complete CRUD operations for products
  - Add/Edit/Delete products
  - Image upload and management
  - Category and brand assignment
  - Inventory management
- **Order Management**: Comprehensive order processing system
  - View all customer orders
  - Order status updates
  - Order details and tracking
- **Brand Management**: Clothing brand administration
  - Add/Edit/Delete brands
  - Brand logo management
- **User Management**: Customer account administration
- **Content Management**: Dynamic content editing
  - FAQ management
  - About Us page content
  - Contact query handling
- **Filter Management**: Product filtering system administration
- **Chat Support**: Customer support chat interface for admins

### **3. Shopping Experience**
- **Product Catalog**: Comprehensive product browsing
  - Category-based navigation
  - Brand filtering
  - Price range filtering
- **Advanced Product Search**: Intelligent search functionality
  - Keyword-based search
  - Filter combinations
  - Search result pagination
- **Product Details**: Rich product information display
  - High-quality images
  - Detailed descriptions
  - Customer reviews
  - Related products
- **Shopping Cart**: Full cart management system
  - Add/Remove items
  - Quantity adjustment
  - Cart persistence
  - Price calculations
- **Checkout Process**: Streamlined checkout experience
  - Address selection
  - Payment method selection
  - Order confirmation
- **Order Tracking**: Complete order lifecycle management
  - Order status tracking
  - Order history
  - Order details
- **User Account**: Comprehensive account management
  - Order history
  - Address management
  - Account 


### **4. Payment System**
- **PayPal Integration**: Secure payment processing
  - PayPal checkout
  - Payment verification
- **Order Confirmation**: Automated email notifications
- **Refund Processing**: Automated refund system with email notifications

### **5. Real-time Features**
- **Live Chat System**: Real-time customer support
  - Customer-to-admin chat
  - Chat history persistence
  - Real-time message delivery
- **Socket.io Integration**: WebSocket-based real-time communication
- **Chat History**: Persistent chat conversations
- **Admin Chat Interface**: Dedicated support agent dashboard


### **6. Content Management**
- **About Us Management**: Dynamic company information editing
- **FAQ System**: Comprehensive FAQ management
  - Add/Edit/Delete FAQs
  - Category organization
  - Search functionality
- **Contact Form**: Customer inquiry handling system
- **Dynamic Content**: Admin-editable content throughout the site

### **7. Image & Media Handling**
- **Cloudinary Integration**: Cloud-based image storage
  - Automatic image optimization
  - Multiple format support
  - CDN delivery
- **Image Upload**: Comprehensive image management
  - Product images
  - User profile pictures
  - Review images

### **8. Search & Filtering**
- **Advanced Search**: Intelligent product search functionality
  - Keyword matching
  - Category filtering
  - Brand filtering
  - Price range filtering
- **Filter System**: Comprehensive filtering options
  - Multiple filter combinations
  - Filter persistence
  - Filter management
- **Search Results**: Paginated and sorted search results
- **Filter Management**: Admin-controlled filter system


### **9. Responsive Design**
- **Mobile-First Design**: Responsive design approach
- **Cross-browser Compatibility**: Multi-browser support
- **Accessibility**: WCAG compliance features
- **Progressive Web App**: PWA capabilities

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 + Vite | Modern UI framework with fast build tooling |
| **Styling** | Tailwind CSS + Radix UI | Utility-first CSS + Accessible component library |
| **State Management** | Redux Toolkit | Global state management with dev tools |
| **Routing** | React Router DOM | Client-side routing |
| **Backend** | Node.js + Express | API server with middleware support |
| **Database** | MongoDB + Mongoose | NoSQL database with ODM |
| **Authentication** | Passport.js + JWT | Multi-strategy authentication |
| **Real-time** | Socket.io | WebSocket-based real-time communication |
| **Payment** | PayPal REST SDK | Secure payment processing |
| **Storage** | Cloudinary | Cloud media storage and CDN |
| **Email** | SendInBlue | Transactional email service |
| **File Upload** | Multer | Multipart form handling |
| **OAuth** | Google OAuth 2.0 | Social authentication |
| **Session** | Express Session | Server-side session management |
| **CORS** | CORS middleware | Cross-origin resource sharing |

## 📊 Summary

| Directory | Files | Subdirectories | Description |
|-----------|-------|----------------|-------------|
| **Client** | React frontend application |
| **Server** | Node.js backend API |


## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- PayPal Developer Account
- Cloudinary Account
- SendInBlue Account


## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 👥 Authors

- **Hasib**
- **Abid** 

## 🙏 Acknowledgments

- PayPal for payment processing
- Cloudinary for media management
- SendInBlue for email services

---

**NEO** - Discover new trends, everyday. 

# Shopiy (Ecommerce App)

Shopiy is a full-featured ecommerce backend application built using Node.js, Express, and MongoDB. It provides a robust API for managing users, products, categories, and orders, demonstrating modern web development practices.

## Features

- **User Authentication**: Secure login and registration.
- **Product Management**: Full CRUD operations for ecommerce products.
- **Cart & Order Processing**: Managing user carts and processing checkouts.
- **Payment Integration**: Stripe integration for handling secure payments.
- **Responsive Views**: EJS templates styled with modern CSS practices (via Tailwind CSS).
- **Secure Architecture**: Utilizing JWT for authentication and bcrypt for password hashing.
- **File Uploads**: Image handling using Multer.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JSON Web Tokens (JWT), bcrypt
- **Templating**: EJS
- **Payments**: Stripe
- **Environment Management**: dotenv

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Shopiy
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory and add the necessary environment variables.
   *(Note: The `.env` file is intentionally omitted from version control for security purposes).*
   
   Typical variables needed:
   - `PORT`: The port the server will run on (e.g., 3000)
   - `EXPRESS_SESSION_SECRET`: Secret key for session management
   - `JWT_KEY`: Secret key for signing JWT tokens
   - `STRIPE_KEY`: Stripe API secret key
   - `MONGODB_URI`: MongoDB connection string

4. Start the application:
   ```bash
   npm start
   ```

## License

This project is licensed under the ISC License.

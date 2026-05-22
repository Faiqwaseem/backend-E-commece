/*
|--------------------------------------------------------------------------
| APP NAME
|--------------------------------------------------------------------------
*/

const APP_NAME = "Stellar E-Commerce API";

/*
|--------------------------------------------------------------------------
| ENVIRONMENT
|--------------------------------------------------------------------------
*/

const NODE_ENV = process.env.NODE_ENV || "development";

/*
|--------------------------------------------------------------------------
| USER ROLES
|--------------------------------------------------------------------------
*/

const ROLES = {
  USER: "user",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
};

/*
|--------------------------------------------------------------------------
| ORDER STATUS
|--------------------------------------------------------------------------
*/

const ORDER_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

/*
|--------------------------------------------------------------------------
| PAYMENT STATUS
|--------------------------------------------------------------------------
*/

const PAYMENT_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
};

/*
|--------------------------------------------------------------------------
| PAYMENT METHODS
|--------------------------------------------------------------------------
*/

const PAYMENT_METHODS = {
  COD: "cash_on_delivery",
  STRIPE: "stripe",
  JAZZCASH: "jazzcash",
  EASYPAISA: "easypaisa",
};

/*
|--------------------------------------------------------------------------
| PRODUCT STATUS
|--------------------------------------------------------------------------
*/

const PRODUCT_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  OUT_OF_STOCK: "out_of_stock",
};

/*
|--------------------------------------------------------------------------
| AUTH
|--------------------------------------------------------------------------
*/

const JWT_EXPIRES_IN = "7d";
const COOKIE_NAME = "jwt";

/*
|--------------------------------------------------------------------------
| PAGINATION
|--------------------------------------------------------------------------
*/

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

/*
|--------------------------------------------------------------------------
| HTTP STATUS CODES
|--------------------------------------------------------------------------
*/

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

/*
|--------------------------------------------------------------------------
| API MESSAGES
|--------------------------------------------------------------------------
*/

const MESSAGES = {
  LOGIN_SUCCESS: "Login successful",
  REGISTER_SUCCESS: "Account created successfully",
  LOGOUT_SUCCESS: "Logout successful",
  UNAUTHORIZED: "Unauthorized access",
  FORBIDDEN: "Access denied",
  USER_NOT_FOUND: "User not found",
  INVALID_CREDENTIALS: "Invalid email or password",
  PRODUCT_CREATED: "Product created successfully",
  ORDER_PLACED: "Order placed successfully",
};

/*
|--------------------------------------------------------------------------
| REGEX
|--------------------------------------------------------------------------
*/

const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/,
  PHONE: /^[0-9]{11}$/,
};

/*
|--------------------------------------------------------------------------
| EXPORTS
|--------------------------------------------------------------------------
*/

module.exports = {
  APP_NAME,
  NODE_ENV,
  ROLES,
  ORDER_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
  PRODUCT_STATUS,
  JWT_EXPIRES_IN,
  COOKIE_NAME,
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  MAX_LIMIT,
  HTTP_STATUS,
  MESSAGES,
  REGEX,
};

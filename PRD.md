# Product Requirements Document (PRD)

# POS Cashier Application --- Phase 1

Version: 1.0\
Product Type: Internal Coffee Shop POS System\
Platform: Desktop Web Application

------------------------------------------------------------------------

# 1. Overview

## 1.1 Purpose

The POS Cashier Application is a modern web-based cashier system
designed for coffee shop and F&B operations.

The application replaces the existing outdated cashier system with a
faster, easier-to-use, and scalable solution for daily sales
transactions.

The system focuses on cashier operations: - Creating customer orders -
Managing cart transactions - Processing payments - Printing receipts -
Printing kitchen tickets - Managing cashier shifts - Tracking
transaction history

Inventory management is not included in this phase. Product information
will be provided by a separate Inventory Management System.

------------------------------------------------------------------------

## 1.2 Problem Statement

The current cashier application is outdated and creates operational
limitations: - Slow transaction process - Difficult menu management -
Limited scalability - Poor reporting capability - Limited hardware
integration

The new POS system provides a reliable cashier workflow and prepares the
foundation for future multi-outlet operations.

------------------------------------------------------------------------

## 1.3 Goal

The main goals: - Reduce transaction time at cashier counter - Improve
cashier accuracy - Provide centralized transaction data - Support
multiple payment methods - Enable future multi-outlet expansion

------------------------------------------------------------------------

# 2. Requirements

## 2.1 Platform Requirement

The application must support: - Desktop web browser - POS computer
environment - Touch-friendly interface - Keyboard and mouse input

------------------------------------------------------------------------

## 2.2 User Requirement

Phase 1 user: - Cashier

Future users: - Owner - Manager - Admin - Inventory Staff

------------------------------------------------------------------------

## 2.3 Transaction Input

Supported order types: - Dine In - Take Away

Customer information: - Customer name (optional) - Table number
(optional)

------------------------------------------------------------------------

## 2.4 Product Data

POS receives product data from Inventory System.

Required fields: - Product ID - Product Name - Category - Price -
Image - Availability - Modifier

------------------------------------------------------------------------

## 2.5 Payment Requirement

Supported payment: - Cash - QRIS Static - Debit Card through external
EDC

The system records payment information only.

------------------------------------------------------------------------

## 2.6 Discount Requirement

Support voucher discount: - Voucher code - Discount type - Discount
value - Minimum transaction - Expiry date - Active status

------------------------------------------------------------------------

# 3. Core Features

## 3.1 Cashier Login

Features: - Login - Logout - Session tracking

------------------------------------------------------------------------

## 3.2 Shift Management

Open shift: - Opening cash balance - Cashier identity - Start time

Close shift: - Sales summary - Payment breakdown - Cash difference

------------------------------------------------------------------------

## 3.3 Product Selection

Interface: - Product grid - Category filter - Product search - Add
product - Select modifier

------------------------------------------------------------------------

## 3.4 Cart Management

Cashier can: - Increase quantity - Decrease quantity - Remove item -
Edit modifier - Add notes

------------------------------------------------------------------------

## 3.5 Order Management

Supported: - Hold order - Cancel order - Refund - Reprint receipt

------------------------------------------------------------------------

## 3.6 Checkout

Flow: - Review order - Apply voucher - Calculate tax - Calculate service
charge - Select payment - Confirm transaction

------------------------------------------------------------------------

## 3.7 Printing

Supported hardware: - Thermal receipt printer - Kitchen ticket printer -
Cash drawer

Hardware can be enabled or disabled.

------------------------------------------------------------------------

# 4. User Flow

``` text
Cashier Login
↓
Open Shift
↓
Select Order Type
↓
Select Product
↓
Configure Modifier
↓
Review Cart
↓
Apply Voucher
↓
Select Payment
↓
Confirm Transaction
↓
Print Receipt
↓
Print Kitchen Ticket
↓
Transaction Completed
```

------------------------------------------------------------------------

# 5. Architecture

``` mermaid
sequenceDiagram
participant User as Cashier
participant Frontend as POS Frontend
participant Backend as POS Backend API
participant DB as Central Database
participant Printer as Hardware Printer

User->>Frontend: Login
Frontend->>Backend: Authenticate
Backend->>DB: Validate User
DB-->>Backend: User Data
Backend-->>Frontend: Session Created

User->>Frontend: Create Order
Frontend->>Backend: Submit Transaction
Backend->>DB: Save Transaction
DB-->>Backend: Transaction ID
Backend-->>Frontend: Success

Frontend->>Printer: Print Receipt
Frontend->>Printer: Print Kitchen Ticket
Printer-->>Frontend: Print Status
```

------------------------------------------------------------------------

# 6. Database Schema

``` mermaid
erDiagram

USERS {
id bigint PK
username varchar
password_hash varchar
role varchar
status varchar
}

SHIFTS {
id bigint PK
user_id bigint FK
opening_cash decimal
closing_cash decimal
start_time datetime
end_time datetime
status varchar
}

TRANSACTIONS {
id bigint PK
shift_id bigint FK
order_type varchar
customer_name varchar
table_number varchar
subtotal decimal
tax decimal
service_charge decimal
discount decimal
total decimal
payment_method varchar
status varchar
created_at datetime
}

TRANSACTION_ITEMS {
id bigint PK
transaction_id bigint FK
product_id bigint
product_name varchar
quantity int
price decimal
}

USERS ||--o{ SHIFTS : creates
SHIFTS ||--o{ TRANSACTIONS : contains
TRANSACTIONS ||--o{ TRANSACTION_ITEMS : contains
```

------------------------------------------------------------------------

# 7. Design & Technical Constraints

## System Constraints

The system must: - Use centralized database - Support future multi
outlet - Separate POS and Inventory system - Provide API integration
capability

## Performance

Expected: - Product loading under 2 seconds - Transaction confirmation
under 3 seconds

## UI/UX Rules

-   Product grid on left side
-   Cart panel on right side
-   Large buttons
-   Minimal clicks
-   Touch-friendly interface

## Failure Handling

Network failure: - Show error - Prevent duplicate transaction - Allow
retry

Printer failure: - Save transaction - Allow reprint

Payment failure: - Allow retry - Prevent duplicate submission

------------------------------------------------------------------------

End of PRD --- POS Cashier Application Phase 1

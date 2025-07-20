# Parcel Delivery Management System (Frontend)

## Project Overview

This is the frontend repository for a modern Parcel Delivery Management System. The application is designed to streamline the process of managing parcel deliveries, from rider applications and assignments to tracking delivery statuses and managing rider earnings. It provides distinct interfaces for administrators and riders, ensuring secure and role-based access to functionalities.

## Features

The application offers a robust set of features categorized by user roles:

### Admin Features

* **Pending Rider Management:**
    * View and manage new rider applications.
    * Approve or reject rider applications with confirmation.
* **Active Rider Management:**
    * View a list of all active riders.
    * Search active riders by name, email, or contact.
* **Parcel Assignment (`AssignRider`):**
    * View all parcels in the system.
    * Assign available riders to parcels via a modal interface.
    * Intelligent rider suggestions based on `senderDistrict` matching `rider.wire_house`.
    * Confirmation dialogs for assignment actions.
    * Updates parcel `delivery_status` to `in_transit` and assigns `rider_id`/`rider_name`.
* **Pending Delivery Parcels (`PendingDelivery`):**
    * View parcels that are `not_collected` or `pending` delivery status.
    * Facilitates the assignment process for these specific parcels.

### Rider Features

* **Pending Tasks (`PendingDelivery` - Rider View):**
    * View parcels specifically assigned to the logged-in rider with `delivery_status` as `rider_assign` or `in_transit`.
    * **"Pick Up" Action:** For parcels with `delivery_status: 'rider_assign'`, riders can mark them as `in_transit`.
    * **Conditional Delivery Actions:** For parcels `in_transit`:
        * **"Deliver Parcel" Button:** If `parcel.wire_house` matches `parcel.receiverDistrict` (same district delivery), riders can mark the parcel as `delivered`.
        * **"Deliver to Wire House" Button:** If `parcel.wire_house` does NOT match `parcel.receiverDistrict` (inter-district delivery), riders can mark the parcel as `delivered_to_wire_house`.
    * Confirmation dialogs for all status updates.
* **My Delivered Parcels (`MyDeliveredParcel`):**
    * View a list of all parcels successfully `delivered` by the rider.
    * **Rider Earning Calculation:** Dynamically calculates earning for each parcel:
        * 75% of `cost` if `receiverDistrict === senderDistrict`.
        * 35% of `cost` if `receiverDistrict !== senderDistrict`.
    * **Cash Out Functionality:**
        * Displays a "Cash Out" button if `cash_out_time` is not present in parcel data.
        * Displays "Cashed out" text if `cash_out_time` exists.
        * Uses `useMutation` to update `cash_out_time` on cash out.
* **My Total Earning (`MyTotalEarning`):**
    * Provides a comprehensive overview of rider earnings.
    * Displays earnings breakdown for: Today, Last Week, Last Month, Last Year.
    * Shows total cashed out amount.
    * Shows total pending cash out amount.

### General Features

* **Role-Based Access Control (RBAC):** Implemented using custom hooks (`useUserRole`) and `react-router-dom`'s `PrivateRoute` (conceptual) to secure routes and UI elements based on user roles (e.g., `admin`, `rider`).
* **Global State Management:** Leverages `@tanstack/react-query` for efficient data fetching, caching, synchronization, and mutations, reducing boilerplate and improving performance.
* **API Communication:** Uses `axios` for making HTTP requests to the backend API.
* **User Notifications:** Integrates `sweetalert2` for visually appealing and interactive alerts, confirmations, and success/error messages.
* **Date & Time Handling:** Utilizes `date-fns` for robust date parsing, formatting, and calculations (e.g., for earnings breakdown).
* **Responsive UI:** Styled with Tailwind CSS and DaisyUI components, ensuring a modern and adaptive user interface across various devices.
* **Smooth Navigation:** Implements a `ScrollToTop` component to automatically scroll the window to the top on route changes.
* **Error Handling:** Includes a generic "Forbidden" page for unauthorized access attempts.

## Technologies Used

* **Frontend Framework:** React.js
* **State Management/Data Fetching:** `@tanstack/react-query`
* **HTTP Client:** `axios`
* **Routing:** `react-router-dom`
* **UI Library/Styling:** Tailwind CSS, DaisyUI
* **Alerts/Notifications:** `sweetalert2`
* **Date Utilities:** `date-fns`
* **Icons:** `react-icons/fa` (Font Awesome)

## Setup and Installation

Follow these steps to get the project up and running on your local machine.

### Prerequisites

* Node.js (LTS version recommended)
* npm or yarn (npm is typically installed with Node.js)

### Clone the Repository

```bash
git clone <your-repository-url>
cd <your-project-folder>

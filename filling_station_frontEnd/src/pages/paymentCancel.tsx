
import { Link } from "react-router-dom";
import { MdCancel } from "react-icons/md";
import "../pages/paymentCancel.css";

const PaymentCancel = () => {
  return (
    <div className="payment-status-container">
      <div className="payment-status-card">
        <MdCancel className="payment-status-icon cancel" />

        <h1>Payment Cancelled</h1>

        <p>
          Your registration payment was cancelled.
          Your account has not been activated yet.
        </p>

        <Link to="/register" className="payment-status-button">
          Try Again
        </Link>

        <Link to="/" className="payment-status-link">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default PaymentCancel;
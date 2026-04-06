// src/PaymentForm.js

import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useCart } from "../Context/CartContext";

const PaymentForm = () => {
  const { cart, addToCart, removeFromCart } = useCart();

  console.log(cart.map((cart) => cart.price));

  const prices = cart.map((cart) => cart.price)

  function sumPrices(prices) {
    return prices.reduce((total, price) => {
      const cents = Math.round(parseFloat(price.replace('$', '')) * 100);
      return total + cents;
    }, 0);
  }

  const total = sumPrices(prices);

  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState(total); // Amount in cents
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    const { error: paymentError, paymentIntent } =
      await stripe.confirmCardPayment(
        await fetch("/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount }),
        })
          .then((res) => res.json())
          .then((data) => data.client_secret),
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

    if (paymentError) {
      setError(paymentError.message);
      setSuccess(false);
    } else {
      setSuccess(true);
      setError(null);
      console.log("Payment Intent:", paymentIntent);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Pay ${amount / 100}
      </button>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && <div style={{ color: "green" }}>Payment successful!</div>}
    </form>
  );
};

export default PaymentForm;

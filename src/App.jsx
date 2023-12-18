import { useCallback, useEffect, useState } from "react";
import "./App.css";
import "./App.scss";
import Card from "./components/card/card";
import Cart from "./components/cart/cart";
import { getData } from "./constans/db";

const courses = getData();

const telegram = window.Telegram.WebApp;

const App = () => {
  const [cartItems, setcartItems] = useState([]);

  useEffect(() => {
    telegram.ready();
  });

  const onAddItem = (item) => {
    const exisItem = cartItems.find((c) => c.id == item.id);

    if (exisItem) {
      const newData = cartItems.map((c) =>
        c.id == item.id ? { ...exisItem, quantity: exisItem.quantity + 1 } : c
      );
      setcartItems(newData);
    } else {
      const newData = [...cartItems, { ...item, quantity: 1 }];
      setcartItems(newData);
    }
  };

  const onRemoveItem = (item) => {
    const exisItem = cartItems.find((c) => c.id == item.id);
    if (exisItem.quantity === 1) {
      const newData = cartItems.filter((c) => c.id !== exisItem.id);
      setcartItems(newData);
    } else {
      const newData = cartItems.map((c) =>
        c.id === exisItem.id
          ? { ...exisItem, quantity: exisItem.quantity - 1 }
          : c
      );
      setcartItems(newData);
    }
  };

  const onCheckout = () => {
    telegram.MainButton.text = "Sotib olsh :)";
    telegram.MainButton.show();
  };

  const onSendData = useCallback(() => {
    telegram.senData(JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    telegram.onEvent("mainButtonClicked", onSendData);

    return () => telegram.offEvent("mainButtonClicked", onSendData);
  }, [onSendData]);
  return (
    <>
      <h1 className="heading">Kurslaim</h1>
      <Cart cartItems={cartItems} onCheckout={onCheckout} />
      <div className="cards__container">
        {courses.map((course) => (
          <Card
            key={course.id}
            course={course}
            onAddItem={onAddItem}
            onRemoveItem={onRemoveItem}
          />
        ))}
      </div>
    </>
  );
};

export default App;

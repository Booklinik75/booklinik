import { useState, useEffect } from "react";
import firebase from "firebase/clientApp";
import { checkAuth } from "utils/ServerHelpers";
import DashboardUi from "components/DashboardUi";
import BookingCard from "components/BookingCard";

export const getServerSideProps = checkAuth;

const DashboardOperations = ({ userProfile, token }) => {
  const [bookings, setBookings] = useState([]);

  console.log(userProfile);

  useEffect(() => {
    const asyncFunc = async () => {
      const entries = [];

      await firebase
        .firestore()
        .collection("bookings")
        .where("user", "==", token.uid)
        .get()
        .then((item) => {
          console.log(item);
          return item.forEach((doc) =>
            entries.push({
              id: doc.id,
              ...doc.data(),
            })
          );
        });

      setBookings(entries);
    };

    asyncFunc();
  }, []);

  console.log(bookings);

  return (
    <DashboardUi userProfile={userProfile} token={token}>
      <div className="col-span-12 space-y-3 transition">
        <h1 className="text-4xl">Mes opérations ({bookings?.length})</h1>
        <p className="flex items-center gap-2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>

      {bookings.map((booking) => (
        <BookingCard booking={booking} key={booking.id} />
      ))}
    </DashboardUi>
  );
};

export default DashboardOperations;

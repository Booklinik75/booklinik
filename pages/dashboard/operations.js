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
        <div className="col-span-6">
          <h1 className="text-4xl">Mes opérations ({bookings?.length})</h1>
          <p className="flex items-center gap-2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        <div className="grid grid-cols-6 gap-8">
          {bookings.map((booking) => (
            <div key={booking.id} className="col-span-2">
              <BookingCard booking={booking} />
            </div>
          ))}
        </div>
      </div>
    </DashboardUi>
  );
};

export default DashboardOperations;

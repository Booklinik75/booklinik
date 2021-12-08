import { useState, useEffect } from "react";
import firebase from "firebase/clientApp";
import { checkAuth } from "utils/ServerHelpers";
import DashboardUi from "components/DashboardUi";
import BookingCard from "components/BookingCard";

export const getServerSideProps = checkAuth;

const DashboardOperations = ({ userProfile, token }) => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const asyncFunc = async () => {
      const entries = [];

      await firebase
        .firestore()
        .collection("bookings")
        .where("user", "==", token.uid)
        .get()
        .then((item) => {
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

  return (
    <DashboardUi userProfile={userProfile} token={token}>
      <div className="col-span-12 space-y-3 transition">
        <div className="col-span-6">
          <h1 className="text-4xl">Mes opérations ({bookings?.length})</h1>
        </div>
        <div className="grid grid-cols-6 gap-8">
          {bookings.map((booking) => (
            <div key={booking.id} className="col-span-6 lg:col-span-2">
              <BookingCard booking={booking} />
            </div>
          ))}
        </div>
      </div>
    </DashboardUi>
  );
};

export default DashboardOperations;

/* eslint-disable react/jsx-key */
import { useMemo } from "react";
import DashboardUi from "components/DashboardUi";
import { checkAuth } from "utils/ServerHelpers";
import firebase from "firebase/clientApp";
import { useTable } from "react-table";
import Link from "next/link";
import moment from "moment";
import CsvDownload from "react-json-to-csv";

export const getServerSideProps = async (ctx) => {
  const auth = await checkAuth(ctx);
  if (auth.redirect) return auth;

  const bookings = [];

  await firebase
    .firestore()
    .collection("bookings")
    .get()
    .then(async (querySnapshot) => {
      await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          await firebase
            .firestore()
            .collection("users")
            .doc(doc.data().user)
            .get()
            .then((userData) => {
              bookings.push({
                ...doc.data(),
                id: doc.id,
                customer: userData.data(),
              });
            });
        })
      );
    });

  bookings.map((userBooking) => {
    userBooking.startDate = new Date(userBooking.startDate.toDate()).toString();
    userBooking.endDate = new Date(userBooking.endDate.toDate()).toString();
  });

  return {
    props: {
      auth,
      bookings,
    },
  };
};

const BookingsList = ({ auth, bookings }) => {
  const statusOptions = [
    { value: "awaitingDocuments", label: "En attente de photos" },
    { value: "examining", label: "En cours d'examen" },
    { value: "awaitingEstimate", label: "En attente de devis" },
    { value: "awaitingPayment", label: "En attente de règlement" },
    { value: "validated", label: "Validé" },
    { value: "cancelled", label: "Annulé" },
  ];

  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "Opération", accessor: "surgery" },
      { Header: "Status", accessor: "status" },
      { Header: "Catégorie", accessor: "category" },
      { Header: "E-mail", accessor: "email" },
      { Header: "Dates", accessor: "dates" },
    ],
    []
  );

  const memoizedData = useMemo(
    () => [
      bookings.map((booking) => {
        return {
          id: booking.id,
          surgery: booking.surgeryName,
          status:
            statusOptions.filter(
              (option) => option.value === booking?.status
            )[0]?.label || "—",
          category: booking.surgeryCategoryName,
          email: booking.customer.email,
          dates: `${moment(booking.startDate).format(
            "DD[/]MM[/]YY"
          )} - ${moment(booking.endDate).format("DD[/]MM[/]YY")}`,
        };
      }),
    ],
    []
  );

  const tableInstance = useTable({ columns, data: memoizedData[0] });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <DashboardUi userProfile={auth.props.userProfile} token={auth.props.token}>
      <div className="col-span-6 flex flex-col w-full gap-6">
        <div className="flex gap-4 justify-between items-center">
          <h1 className="text-4xl">Réservations</h1>
          <CsvDownload
            data={bookings}
            filename="bookings.csv"
            className="min-w-max transition px-10 py-3 rounded border border-shamrock bg-shamrock text-white hover:text-shamrock group hover:bg-white"
          >
            Exporter
          </CsvDownload>
        </div>
        <table {...getTableProps()} className="w-full">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()} className="p-1">
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <Link
                  href={`/dashboard/sales/bookings/${row.values.id}`}
                  passHref
                >
                  <tr
                    {...row.getRowProps()}
                    className="hover:cursor-pointer hover:bg-gray-100"
                  >
                    {row.cells.map((cell) => {
                      return (
                        <td
                          {...cell.getCellProps()}
                          className="p-1 text-center"
                        >
                          <div
                            className={`${
                              cell.column.Header === "ID" &&
                              "bg-gray-200 font-mono text-red-900 text-xs p-2 rounded max-w-max"
                            }`}
                          >
                            {cell.render("Cell")}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                </Link>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardUi>
  );
};

export default BookingsList;

/* eslint-disable react/jsx-key */
import { useEffect, useMemo, useState } from "react";
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
    userBooking.startDate =
      typeof userBooking.startDate === "string"
        ? userBooking.startDate
        : new Date(userBooking.startDate.toDate()).toString();
    userBooking.endDate =
      typeof userBooking.endDate === "string"
        ? userBooking.endDate
        : new Date(userBooking.endDate.toDate()).toString();
    userBooking.created = userBooking.created
      ? typeof userBooking.created === "string"
        ? userBooking.created
        : new Date(userBooking?.created?.toDate()).toString()
      : "";
  });

  return {
    props: {
      auth,
      bookings,
    },
  };
};

const BookingsList = ({ auth, bookings }) => {
  const [openFilter, setOpenFilter] = useState(false);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
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
      { Header: "Date de la demande", accessor: "created" },
    ],
    []
  );

  function truncate(str, n) {
    return str.length > n ? str.substr(0, n - 1) + "..." : str;
  }
  const surgeriesName = (surgeries) => {
    const surgeryNames = [];
    surgeries.map((operation) => surgeryNames.push(operation.surgeryName));
    if (surgeryNames.length > 1) {
      return truncate(surgeryNames.join(", "), 40);
    } else {
      return surgeryNames[0];
    }
  };

  const surgeryCategoriesName = (surgeries) => {
    const surgeryNameCategories = [];
    surgeries.map((operation) =>
      surgeryNameCategories.push(operation.surgeryCategoryName)
    );
    if (surgeryNameCategories.length > 1) {
      return truncate(surgeryNameCategories.join(", "), 40);
    } else {
      return surgeryNameCategories[0];
    }
  };

  const memoizedData = useMemo(
    () => [
      bookings.map((booking) => {
        return {
          id: booking.id,
          surgery: surgeriesName(booking.surgeries),
          status:
            statusOptions.filter(
              (option) => option.value === booking?.status
            )[0]?.label || "—",
          category: surgeryCategoriesName(booking.surgeries),
          email: booking.customer.email,
          dates: `${moment(booking.startDate).format(
            "DD[/]MM[/]YY"
          )} - ${moment(booking.endDate).format("DD[/]MM[/]YY")}`,
          created:
            booking.created === ""
              ? "-"
              : moment(booking.created).format("DD[/]MM[/]YY"),
        };
      }),
    ],
    []
  );

  const tableInstance = useTable({ columns, data: memoizedData[0] });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  const [newRows, setNewRows] = useState(rows);

  const getFilter = (value) => {
    let newRowLists;
    if (value === "ID") {
      newRowLists = rows.filter((row) =>
        row.values.id.toLowerCase().includes(search)
      );
    } else if (value === "E-mail") {
      newRowLists = rows.filter((row) =>
        row.values.email.toLowerCase().includes(search)
      );
    } else if (value === "Opération") {
      newRowLists = rows.filter((row) =>
        row.values.surgery.toLowerCase().includes(search)
      );
    } else if (value === "Status") {
      newRowLists = rows.filter((row) =>
        row.values.status.toLowerCase().includes(search)
      );
    } else if (value === "Catégorie") {
      newRowLists = rows.filter((row) =>
        row.values.category.toLowerCase().includes(search)
      );
    } else if (value === "Dates") {
      newRowLists = rows.filter((row) =>
        row.values.dates.toLowerCase().includes(search)
      );
    } else {
      newRowLists = rows.filter(
        (row) =>
          row.values.category.toLowerCase().includes(search) ||
          row.values.email.toLowerCase().includes(search) ||
          row.values.id.toLowerCase().includes(search) ||
          row.values.status.toLowerCase().includes(search) ||
          row.values.surgery.toLowerCase().includes(search) ||
          row.values.dates.toLowerCase().includes(search)
      );
    }

    // check first if search result still empty so use original rows
    setNewRows(search.trim() === "" ? rows : newRowLists);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    getFilter(filter);
  };

  const handleFilter = (value) => {
    setOpenFilter(false);
    setFilter(value);
    getFilter(value);
  };

  useEffect(() => {
    // shrink or close dropdown if we clicked outside the filter or filter lists
    document.onclick = (e) => {
      if (e.target.closest("#bookings-filter") === null) {
        setOpenFilter(false);
      }
    };
  }, []);

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
        <form
          className="flex items-center w-full gap-5 mt-7 mb-7"
          onSubmit={handleSearch}
        >
          <input
            placeholder="Chercher ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded bg-transparent border p-3 outline-none"
          />
          <div className="relative">
            <button
              type="button"
              className="min-w-max transition px-6 py-3 rounded text-shamrock flex items-center gap-2 bg-lightGreen border-lightGreen"
              id="bookings-filter"
              onClick={() => setOpenFilter((openFilter) => !openFilter)}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.28571 4.85712C1.28571 4.30482 1.5997 3.85712 1.987 3.85712H16.013C16.4003 3.85712 16.7143 4.30482 16.7143 4.85712C16.7143 5.40941 16.4003 5.85712 16.013 5.85712H1.987C1.5997 5.85712 1.28571 5.40941 1.28571 4.85712Z"
                  fill="#33C783"
                />
                <path
                  d="M4.44153 9.63837C4.44153 9.08608 4.75552 8.63837 5.14283 8.63837H12.8571C13.2444 8.63837 13.5584 9.08608 13.5584 9.63837C13.5584 10.1906 13.2444 10.6384 12.8571 10.6384H5.14283C4.75552 10.6384 4.44153 10.1906 4.44153 9.63837Z"
                  fill="#33C783"
                />
                <path
                  d="M7.948 13.4196C7.56074 13.4196 7.2467 13.8673 7.2467 14.4196C7.2467 14.9719 7.56074 15.4196 7.948 15.4196H10.0519C10.4392 15.4196 10.7532 14.9719 10.7532 14.4196C10.7532 13.8673 10.4392 13.4196 10.0519 13.4196H7.948Z"
                  fill="#33C783"
                />
              </svg>
              Filtre {filter === "Tout" ? "" : filter}
            </button>
            <ul
              className={`absolute bg-white shadow-lg rounded overflow-hidden w-[calc(100%+5rem)] top-[calc(100%+0.5rem)] ${
                openFilter ? "block" : "hidden"
              }`}
            >
              <li
                className="py-3 px-6 cursor-pointer whitespace-nowrap hover:bg-gray-100"
                onClick={() => handleFilter("Tout")}
              >
                Tout
              </li>
              {headerGroups[0].headers.map((value) => (
                <li
                  key={value.id}
                  className="py-3 px-6 cursor-pointer whitespace-nowrap w-full hover:bg-gray-100"
                  onClick={() => handleFilter(value.Header)}
                >
                  {value.Header}
                </li>
              ))}
            </ul>
          </div>

          <button className="min-w-max transition px-10 py-3 rounded border border-shamrock bg-shamrock text-white hover:text-shamrock group hover:bg-white">
            Chercher
          </button>
        </form>
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
            {newRows.map((row) => {
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

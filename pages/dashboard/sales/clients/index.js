/* eslint-disable react/jsx-key */
import { useEffect, useMemo, useState } from "react";
import DashboardUi from "components/DashboardUi";
import { checkAuth } from "utils/ServerHelpers";
import { firebaseAdmin } from "firebase/clientAdmin";
import firebase from "firebase/clientApp";
import { useTable } from "react-table";
import Link from "next/link";
import CsvDownload from "react-json-to-csv";

export const getServerSideProps = async (ctx) => {
  const auth = await checkAuth(ctx);
  if (auth.redirect) return auth;

  const users = [];

  await firebaseAdmin
    .auth()
    .listUsers()
    .then(async (userRecord) => {
      await Promise.all(
        userRecord.users.map(async (record) => {
          await firebase
            .firestore()
            .collection("users")
            .doc(record.uid)
            .get()
            .then((user) => {
              users.push({
                auth: {
                  uid: record.uid,
                  email: record.email,
                  emailVerified: record.emailVerified,
                  creationTime: record.metadata.creationTime,
                  lastSignInTime: record.metadata.lastSignInTime,
                  lastRefreshTime: record.metadata.lastRefreshTime,
                },
                details: { ...user.data() },
              });
            });
        })
      );
    });

  return {
    props: {
      auth,
      users,
    },
  };
};

const CustomersList = ({ auth, users }) => {
  const [openFilter, setOpenFilter] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "uid" },
      { Header: "Nom et prénom", accessor: "name" },
      { Header: "E-mail", accessor: "email" },
      { Header: "Date d'inscription", accessor: "creationTime" },
    ],
    []
  );

  // can use filter and then using like user.auth[email], or we can test with find to.

  const memoizedData = useMemo(
    () => [
      users.map((user) => {
        return {
          uid: user.auth.uid,
          name:
            !user.details.firstName || !user.details.lastName ? (
              <span className="text-gray-400 italic">Non défini</span>
            ) : (
              `${user.details.firstName} ${user.details.lastName}`
            ),
          email: user.auth.email,
          creationTime: user.auth.creationTime,
        };
      }),
    ],
    []
  );

  const tableInstance = useTable({ columns, data: memoizedData[0] });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  const [newRows, setNewRows] = useState(rows);

  // for filter in searc
  const getFilter = (value) => {
    let newRowLists;
    if (value === "ID") {
      newRowLists = rows.filter((row) =>
        row.values.uid.toLowerCase().includes(search)
      );
    } else if (value === "Nom et prénom") {
      newRowLists = rows.filter((row) =>
        typeof row.values.name !== "string"
          ? ""
          : row.values.email.toLowerCase().includes(search)
      );
    } else if (value === "E-mail") {
      newRowLists = rows.filter((row) =>
        row.values.email.toLowerCase().includes(search)
      );
    } else if (value === "Date d'inscription") {
      newRowLists = rows.filter((row) =>
        row.values.creationTime.toLowerCase().includes(search)
      );
    } else {
      newRowLists = rows.filter(
        (row) =>
          row.values.email.toLowerCase().includes(search) ||
          row.values.uid.toLowerCase().includes(search) ||
          (typeof row.values.name !== "string"
            ? ""
            : row.values.name.toLowerCase().includes(search)) ||
          row.values.creationTime.toLowerCase().includes(search)
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
      if (e.target.closest("#client-filter") === null) {
        setOpenFilter(false);
      }
    };
  }, []);

  return (
    <DashboardUi userProfile={auth.props.userProfile} token={auth.props.token}>
      <div className="col-span-6 flex flex-col w-full gap-6">
        <div className="flex gap-4 justify-between items-center">
          <h1 className="text-4xl">Clients</h1>
          <CsvDownload
            data={users.map((user) => {
              return { ...user.auth, ...user.details };
            })}
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
              id="client-filter"
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
                  className="py-3 px-6 cursor-pointer whitespace-nowrap hover:bg-gray-100"
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
                  href={`/dashboard/sales/clients/${row.values.uid}`}
                  passHref
                >
                  <tr
                    {...row.getRowProps()}
                    className="hover:cursor-pointer hover:bg-gray-100"
                  >
                    {row.cells.map((cell) => {
                      return (
                        <td {...cell.getCellProps()} className="p-1">
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

export default CustomersList;

/* eslint-disable react/jsx-key */
import { useMemo } from "react";
import DashboardUi from "components/DashboardUi";
import { checkAuth } from "utils/ServerHelpers";
import { firebaseAdmin } from "firebase/clientAdmin";
import firebase from "firebase/clientApp";
import { useTable } from "react-table";
import Link from "next/link";

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
  console.log(users);

  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "uid" },
      { Header: "Nom et prénom", accessor: "name" },
      { Header: "E-mail", accessor: "email" },
      { Header: "Date d'inscription", accessor: "creationTime" },
    ],
    []
  );

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

  return (
    <DashboardUi userProfile={auth.props.userProfile} token={auth.props.token}>
      <div className="col-span-6">
        <h1 className="text-4xl">Clients</h1>
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

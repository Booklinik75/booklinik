import firebase from "../firebase/clientApp";

export function formatDate(date) {
  let d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

export async function getFrontEndAsset(fileName) {
  const storageRef = await firebase
    .storage()
    .ref()
    .child("frontendassets")
    .child(fileName)
    .getDownloadURL()
    .then((url) => {
      return url;
    });

  return storageRef;
}

export async function doFileUpload(root, fileName, file) {
  const storageRef = await firebase
    .storage()
    .ref(`${root}/${fileName}`)
    .put(file)
    .then((snapshot) => {
      return snapshot;
    })
    .catch((error) => {});

  return storageRef;
}

export async function getBackEndAsset(path) {
  const storageRef = await firebase
    .storage()
    .ref()
    .child(path)
    .getDownloadURL()
    .then((url) => {
      return url;
    });

  return storageRef;
}

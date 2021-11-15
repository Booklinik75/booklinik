import Error from "next/error";
import Navigation from "../components/Navigation";

export default function Page() {
  return (
    <div>
      <Navigation />
      <div style={{ marginTop: "-120px" }}>
        <Error statusCode="404" title="Page introuvable" />
      </div>
    </div>
  );
}

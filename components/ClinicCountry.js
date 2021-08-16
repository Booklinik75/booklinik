import ClinicCity from "./ClinicCity";

const ClinicCountry = ({ country, cities, clinics }) => {
  return (
    <div className="space-y-6">
      {cities.map((city) => {
        return city.country === country.slug ? (
          <ClinicCity
            city={city}
            key={city.id}
            country={country.name}
            countrySlug={country.slug}
            clinics={clinics}
          />
        ) : (
          ""
        );
      })}
    </div>
  );
};

export default ClinicCountry;

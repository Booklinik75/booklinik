import Clinic from "./Clinic";

const ClinicCity = ({ city, country, countrySlug, clinics }) => {
  return (
    <div className="space-y-2">
      <div className="flex flex-row gap-1.5">
        <h3 className="text-xl">
          {city.name} <span className="text-gray-500">{country}</span>
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {clinics.map((clinic) => {
          return clinic.city === city.slug ? (
            <Clinic
              clinic={clinic}
              key={clinic.id}
              city={city.name}
              citySlug={city.slug}
              country={country}
              countrySlug={countrySlug}
            />
          ) : (
            ""
          );
        })}
      </div>
    </div>
  );
};

export default ClinicCity;

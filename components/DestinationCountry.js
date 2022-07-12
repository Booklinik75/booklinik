import DestinationCity from "./DestinationCity";

const DestinationCountry = ({ country, cities, hotels }) => {
  return (
    <div className="space-y-6">
      {cities.map((city) => {
        return city.country === country.slug ? (
          <DestinationCity
            city={city}
            key={city.id}
            country={country.name}
            countrySlug={country.slug}
            hotels={hotels}
          />
        ) : (
          ""
        );
      })}
    </div>
  );
};

export default DestinationCountry;

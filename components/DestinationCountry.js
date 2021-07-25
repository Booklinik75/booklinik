import DestinationCity from "./DestinationCity";

const DestinationCountry = ({ country }) => {
  return (
    <div>
      {country.cities.map((city) => {
        return (
          <DestinationCity
            city={city}
            key={city.id}
            country={country.name}
            countrySlug={country.slug}
          />
        );
      })}
    </div>
  );
};

export default DestinationCountry;

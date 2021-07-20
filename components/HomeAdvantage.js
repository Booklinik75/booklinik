import { HiCheck } from "react-icons/hi";

const Advantage = () => {
  return (
    <div className="space-y-4">
      <div className="border-2 border-black p-3 rounded-full w-min">
        <HiCheck size={24} />
      </div>
      <h4 className="text-2xl">Réservation simplifiée</h4>
      <p className="text-sm leading-loose text-justify">
        Booklinik est le premier service de reservation en ligne de tourisme
        medical. Plus question de régler vos billets d'avions, hotel et
        opération séparément.
      </p>
    </div>
  );
};

export default Advantage;

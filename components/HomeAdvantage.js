import { HiCheck } from "react-icons/hi";

const Advantage = ({ title, body }) => {
  return (
    <div className="space-y-4">
      <div className="border-2 border-black p-3 rounded-full w-min">
        <HiCheck size={24} />
      </div>
      <h4 className="text-2xl">{title}</h4>
      <p className="text-sm leading-loose text-justify">{body}</p>
    </div>
  );
};

export default Advantage;

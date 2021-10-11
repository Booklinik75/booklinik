import Image from "next/image";

const Advantage = ({ title, body }) => {
  return (
    <div className="space-y-4">
      <Image
        src="/apple-touch-icon.png"
        width={48}
        height={48}
        alt="Booklinik"
      />
      <h4 className="text-3xl">{title}</h4>
      <p className="text-sm leading-loose text-justify">{body}</p>
    </div>
  );
};

export default Advantage;

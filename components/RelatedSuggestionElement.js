import Link from "next/link";
import Image from "next/image";

export default function RelatedElement({ picture, title, target }) {
  return (
    <Link href={target}>
      <a>
        <div className="col-span-1 rounded relative h-60 transition shadow hover:shadow-lg group">
          <Image
            src={picture}
            layout="fill"
            objectFit="cover"
            meta={title}
            className="rounded"
          ></Image>
          <p className="absolute p-5 bottom-2 group-hover:underline">{title}</p>
        </div>
      </a>
    </Link>
  );
}

RelatedElement.defaultProps = {
  picture: "https://via.placeholder.com/1000?text=en+attente+d'image",
  title: "Undefined Element",
  target: "",
};

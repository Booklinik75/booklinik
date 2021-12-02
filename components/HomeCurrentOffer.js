import Image from "next/image";
import * as moment from "node_modules/moment/moment";
import StarRating from "./StarRating";
import firebase from "firebase/clientApp";
import { useState } from "react";
import Link from "next/link";

const Offer = ({ data }) => {
  const { imageUrl, name, endDate, price, hotelData, id } = data;

  return (
    <Link href={`/offer/${id}`}>
      <a className="group hover:cursor-pointer">
        <div className="space-y-1">
          <div className="w-full h-52 relative rounded-xl overflow-hidden mb-3">
            <Image
              src={imageUrl}
              layout="fill"
              objectFit="cover"
              className="w-full transform transition-transform duration-1000 group-hover:scale-110"
              alt={name}
            />
          </div>
          <div className="flex space-x-2 items-center text-xs font-bold uppercase">
            <p className="text-white py-1 px-2 rounded bg-bali">Offre</p>
            <p className="flex-grow text-bali">
              Reste {moment().to(moment(endDate), true)}
            </p>
            <StarRating value={hotelData?.rating} color="bali" />
          </div>
          <p className="font-bold group-hover:underline">{name}</p>
          <div className="flex space-x-1 text-sm text-bali font-bold">
            <p>{hotelData?.name}</p>
            <p>&bull;</p>
            <p>{price}€</p>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default Offer;

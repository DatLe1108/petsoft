"use client";

import { usePetContext } from "@/lib/hook";
import Image from "next/image";

type PetListProps = {};

export default function PetList() {
  const { pets } = usePetContext();
  return (
    <ul className="bg-white border-b border-black/[0.08]">
      {pets.map((pet) => (
        <li key={pet.id}>
          <button className="flex items-center h-[70px] w-full cursor-pointer p-5 text-base gap-3 hover:bg-[#EFF1F2] focus:bg-[#EFF1F2] transition">
            <Image
              src={pet.imageUrl}
              alt="Pet image"
              width={45}
              height={45}
              className="rounded-full object-cover w-[45px] h-[45px]"
            />
            <p className="font-semibold">{pet.name}</p>
          </button>
        </li>
      ))}
    </ul>
  );
}

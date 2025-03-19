"use server";
import prisma from "@/lib/db";
import { sleep } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function addPet(pet) {
  await sleep(2);

  try {
    await prisma.pet.create({
      data: pet,
    });
  } catch (e) {
    return {
      message: "Failed to add pet",
    };
  }

  revalidatePath("/app", "layout");
}

export async function editPet(petId: string, newPetData) {
  await sleep(1);

  try {
    await prisma.pet.update({
      where: {
        id: petId,
      },
      data: newPetData,
    });
  } catch (e) {
    return {
      message: "Failed to edit pet",
    };
  }

  revalidatePath("/app", "layout");
}

export async function deletePet(petId: string) {
  await sleep(1);

  try {
    await prisma.pet.delete({
      where: {
        id: petId,
      },
    });
  } catch (e) {
    return {
      message: "Failed to delete pet",
    };
  }

  revalidatePath("/app", "layout");
}

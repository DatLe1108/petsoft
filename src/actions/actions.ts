"use server";
import { auth, signIn, signOut } from "@/lib/auth";
import prisma from "@/lib/db";
import { sleep } from "@/lib/utils";
import { petFormSchema, petIdSchema } from "@/lib/validation";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

//user actions

export async function logIn(formData: FormData) {
  await signIn("credentials", formData);
}

export async function logOut() {
  await signOut({ redirectTo: "/" });
}

export async function signUp(formData: FormData) {
  const hashedPassword = await bcrypt.hash(
    formData.get("password") as string,
    10
  );

  await prisma.user.create({
    data: {
      email: formData.get("email") as string,
      hashedPassword,
    },
  });

  await signIn("credentials", formData);
}

// pet actions
export async function addPet(pet: unknown) {
  await sleep(1);

  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const validatedPet = petFormSchema.safeParse(pet);

  if (!validatedPet.success) {
    return {
      message: "Invalid pet data",
    };
  }

  try {
    await prisma.pet.create({
      data: {
        ...validatedPet.data,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });
  } catch (e) {
    console.log(e);
    return {
      message: "Failed to add pet",
    };
  }

  revalidatePath("/app", "layout");
}

export async function editPet(petId: unknown, newPetData: unknown) {
  await sleep(1);

  // authentication check
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // validation check
  const validatedPet = petFormSchema.safeParse(newPetData);
  const validatedPetId = petIdSchema.safeParse(petId);

  if (!validatedPet.success || !validatedPetId.success) {
    return {
      message: "Invalid pet data",
    };
  }

  // authorization check
  const pet = await prisma.pet.findUnique({
    where: {
      id: validatedPetId.data,
    },
  });

  if (!pet) {
    return {
      message: "Pet not found",
    };
  }

  if (pet.userId !== session.user.id) {
    return {
      message: "Unauthorized",
    };
  }

  // database mutation
  try {
    await prisma.pet.update({
      where: {
        id: validatedPetId.data,
      },
      data: validatedPet.data,
    });
  } catch (e) {
    return {
      message: "Failed to edit pet",
    };
  }

  revalidatePath("/app", "layout");
}

export async function deletePet(petId: unknown) {
  await sleep(1);

  // authentication check
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // validation check
  const validatedPetId = petIdSchema.safeParse(petId);

  if (!validatedPetId.success) {
    return {
      message: "Invalid pet data",
    };
  }

  //authorization check
  const pet = await prisma.pet.findUnique({
    where: {
      id: validatedPetId.data,
    },
  });

  if (!pet) {
    return {
      message: "Pet not found",
    };
  }

  if (pet.userId !== session.user.id) {
    return {
      message: "Unauthorized",
    };
  }

  //database mutation

  try {
    await prisma.pet.delete({
      where: {
        id: validatedPetId.data,
      },
    });
  } catch (e) {
    return {
      message: "Failed to delete pet",
    };
  }

  revalidatePath("/app", "layout");
}

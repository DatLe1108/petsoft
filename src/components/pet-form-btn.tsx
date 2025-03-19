import { Button } from "./ui/button";

type PetFormBtnProps = {
  actionType: "edit" | "add";
};

export default function PetFormBtn({ actionType }: PetFormBtnProps) {
  return (
    <Button type="submit" className="mt-5 self-end">
      {actionType === "add" ? "Add new pet" : "Edit pet"}
    </Button>
  );
}

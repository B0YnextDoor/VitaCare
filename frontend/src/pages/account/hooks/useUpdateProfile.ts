import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TProfileForm } from "../../../types/user";
import { userService } from "../../../services/user.service";
import { toast } from "sonner";

export const useUpdateProfile = () => {
  const client = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ["profile"],
    mutationFn: (data: TProfileForm) => userService.updateProfile(data),
    onSuccess() {
      toast.success("Profile updated!");
      client.invalidateQueries({ queryKey: ["profile"] });
    },
    onError() {
      toast.error("Updating error!");
    },
  });

  return { update: mutate, isPending };
};

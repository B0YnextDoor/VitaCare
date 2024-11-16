import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { ISignInForm, ISignUpForm } from "../../../types/auth";
import { authService } from "../../../services/auth.service";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const [login, setLogin] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationKey: ["auth"],
    mutationFn: (data: ISignInForm | ISignUpForm) =>
      authService.auth(login ? "in" : "up", data),
    onSuccess() {
      toast.success("Successfully login!");
      return navigate("/home");
    },
    onError(error: any) {
      setIsError(true);
      console.log(error);
      toast.error(error?.response?.data?.error);
    },
  });

  return { auth: mutate, login, setLogin, isError, setIsError };
};

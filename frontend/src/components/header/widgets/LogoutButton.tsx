import { useMutation } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../../services/auth.service";
import { PAGES } from "../../../config/urls";

export function LogoutButton() {
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationKey: ["logout"],
    mutationFn: () => authService.logout(),
    onSuccess: () => navigate(PAGES.AUTH),
  });

  return (
    <div className="ml-1.5">
      <button
        className="opacity-50 hover:opacity-100 transition-opacity duration-300"
        onClick={() => mutate()}
      >
        <LogOut size={25} color="white" />
      </button>
    </div>
  );
}

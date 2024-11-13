import styles from "./Header.module.css";
import { LogoutButton } from "./widgets/LogoutButton";
import { useProfile } from "../../hooks/user/useProfile";
import { Loader } from "../ui/Loader";
import { Profile } from "./widgets/Profile";
import { Link } from "react-router-dom";
import { PAGES } from "../../config/urls";

export const Header = () => {
  const { data, isLoading } = useProfile();

  return (
    <header className={styles.header}>
      <Link to={PAGES.HOME} className={styles.logo}>
        VITACARE
      </Link>
      {isLoading || !data ? (
        <Loader size={20} color="white" />
      ) : (
        <div className="flex items-center">
          <Profile profile={data} />
          <LogoutButton />
        </div>
      )}
    </header>
  );
};

import { useEffect, useRef, useState } from "react";
import "./Auth.css";
import { SignIn } from "./widgets/SignIn";
import { SignUp } from "./widgets/SignUp";
import { Container } from "./widgets/Container";
import { useAuth } from "./hooks/useAuth";
import { useCheckAuth } from "./hooks/useCheckAuth";

export const Auth = () => {
  const ref = useRef(null);
  const [toggle, setToggle] = useState<any>();

  useEffect(() => {
    setToggle(ref.current);
  }, []);

  useCheckAuth();

  const { auth, setLogin, isError, setIsError } = useAuth();

  const handleError = (e: any) => {
    e.preventDefault();
    setIsError(false);
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="container" id="container" ref={ref}>
        <SignUp
          className="sign-up"
          mutate={auth}
          setLogin={setLogin}
          isError={isError}
          handleError={handleError}
        />
        <SignIn
          className="sing-in"
          mutate={auth}
          setLogin={setLogin}
          isError={isError}
          handleError={handleError}
        />
        <Container className="toggle" toggle={toggle} />
      </div>
    </div>
  );
};

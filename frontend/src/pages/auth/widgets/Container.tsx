export const Container: React.FC<any> = ({ toggle }) => {
  return (
    <div className="toggle-container">
      <div className="toggle">
        <div className="toggle-panel toggle-left">
          <h1>Welcome Back!</h1>
          <p>
            Enter your personal details
            <br />
            to sign in
          </p>
          <button
            className="hiddenb"
            onClick={() => {
              toggle.classList.remove("active");
            }}
          >
            Sign In
          </button>
        </div>
        <div className="toggle-panel toggle-right">
          <h1>Hello, Friend!</h1>
          <p>Register to use all of site features</p>
          <button
            className="hiddenb"
            onClick={() => {
              toggle.classList.add("active");
            }}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

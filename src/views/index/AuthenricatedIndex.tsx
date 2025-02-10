import AuthenticationFrame from "../frames/AuthenticationFrame.tsx";
import Index from "./Index.tsx";

function AuthenticatedIndex() {
  return (
    <AuthenticationFrame>
      <Index/>
    </AuthenticationFrame>
  );
}

export default AuthenticatedIndex;

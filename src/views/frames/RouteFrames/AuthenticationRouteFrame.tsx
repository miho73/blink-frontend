import {Route, Routes} from 'react-router-dom';
import CoreSignIn from "../../auth/CoreSignin.tsx";
import PasswordSignIn from "../../auth/PasswordSignIn.tsx";
import NotFound from "../../error/NotFound.tsx";
import CoreRegister from "../../auth/CoreRegister.tsx";
import GoogleCompleteRegister from "../../auth/GoogleCompleteRegister.tsx";
import SetJWT from "../../auth/SetJWT.tsx";
import AuthenticationFrame from "../AuthenticationFrame.tsx";

function AuthenticationRouteFrame() {
  return (
    <AuthenticationFrame
      reverse={true}
      to={'/'}
    >
      <Routes>
        <Route path={'/'} element={<CoreSignIn/>}/>
        <Route path={'/password'} element={<PasswordSignIn/>}/>
        <Route path={'/register'} element={<CoreRegister/>}/>
        <Route path={'/register/google'} element={<GoogleCompleteRegister/>}/>
        <Route path={'/complete'} element={<SetJWT/>}/>
        <Route path={'*'} element={<NotFound/>}/>
      </Routes>
    </AuthenticationFrame>
  );
}

export default AuthenticationRouteFrame;

import {Route, Routes} from 'react-router-dom';
import CoreSignin from "../auth/CoreSignin.tsx";
import PasswordSignin from "../auth/PasswordSignin.tsx";
import NotFound from "../error/NotFound.tsx";
import CoreRegister from "../auth/CoreRegister.tsx";
import GoogleCompleteRegister from "../auth/GoogleCompleteRegister.tsx";
import SetJWT from "../auth/SetJWT.tsx";

function AuthenticatedFrame() {
  return (
    <Routes>
      <Route path={'/'} element={<CoreSignin/>}/>
      <Route path={'/password'} element={<PasswordSignin/>}/>
      <Route path={'/register'} element={<CoreRegister/>}/>
      <Route path={'/register/google'} element={<GoogleCompleteRegister/>}/>
      <Route path={'/complete'} element={<SetJWT/>}/>
      <Route path={'*'} element={<NotFound/>}/>
    </Routes>
  );
}

export default AuthenticatedFrame;

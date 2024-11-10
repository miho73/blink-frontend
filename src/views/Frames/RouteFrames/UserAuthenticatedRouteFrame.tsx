import AuthenticationFrame from "../AuthenticationFrame.tsx";
import {Route, Routes} from "react-router-dom";
import CheckVerificationStatus from "../../user/StudentVerification/CheckVerificationStatus.tsx";
import CoreStudentVerification from "../../user/StudentVerification/CoreStudentVerification.tsx";
import NotFound from "../../error/NotFound.tsx";

function UserAuthenticatedRouteFrame() {
  return (
    <AuthenticationFrame>
      <Routes>
        <Route path={'/student-verification/'} element={<CoreStudentVerification/>}/>
        <Route path={'/student-verification/check'} element={<CheckVerificationStatus/>}/>
        <Route path={'*'} element={<NotFound/>}/>
      </Routes>
    </AuthenticationFrame>
  )
}

export default UserAuthenticatedRouteFrame

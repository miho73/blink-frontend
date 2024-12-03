import AuthenticationFrame from "../AuthenticationFrame.tsx";
import {Route, Routes} from "react-router-dom";
import CheckVerificationStatus from "../../user/StudentVerification/CheckVerificationStatus.tsx";
import CoreStudentVerification from "../../user/StudentVerification/CoreStudentVerification.tsx";
import NotFound from "../../error/NotFound.tsx";
import CoreUser from "../../user/user/CoreUser.tsx";
import CoreUserSettings from "../../user/settings/CoreUserSettings.tsx";

function UserAuthenticatedRouteFrame() {
  return (
    <AuthenticationFrame>
      <Routes>
        <Route path={'/'} element={<CoreUser/>}/>
        <Route path={'/settings'} element={<CoreUserSettings/>}/>
        <Route path={'/student-verification/'} element={<CoreStudentVerification/>}/>
        <Route path={'/student-verification/check'} element={<CheckVerificationStatus/>}/>
        <Route path={'*'} element={<NotFound/>}/>
      </Routes>
    </AuthenticationFrame>
  )
}

export default UserAuthenticatedRouteFrame

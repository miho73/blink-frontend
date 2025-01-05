import AuthenticationFrame from "../AuthenticationFrame.tsx";
import {Route, Routes} from "react-router-dom";
import NotFound from "../../error/NotFound.tsx";
import Welcome from "../../user/Welcome.tsx";

function UserAuthenticatedRouteFrame() {
  return (
    <AuthenticationFrame
      reverse={false} // TODO: CHANGE TO TRUE
      to={'/'}
    >
      <Routes>
        <Route path={'/welcome'} element={<Welcome/>}/>
        <Route path={'*'} element={<NotFound/>}/>
      </Routes>
    </AuthenticationFrame>
  )
}

export default UserAuthenticatedRouteFrame

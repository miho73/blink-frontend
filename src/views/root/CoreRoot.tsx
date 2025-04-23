import RoleFrame from "../frames/RoleFrame.tsx";
import AuthenticationFrame from "../frames/AuthenticationFrame.tsx";
import Stack from "../layout/Stack.tsx";
import {Route, Routes} from "react-router-dom";
import SchoolManagement from "./SchoolManagement/SchoolManagement.tsx";
import {NavigationButton, SchoolNav, SvNav, UserNav} from "./NavigationLinks.tsx";
import {HomeIcon, ProfileIcon, SchoolCapIcon, SchoolIcon} from "../../assets/svgs/svg.tsx";
import SvList from "./SchoolVerification/SvList.tsx";
import SvApprove from "./SchoolVerification/SvApprove.tsx";
import Root404 from "./Root404.tsx";
import UserManagement from "./UserManagement/UserManagement.tsx";

function CoreRoot() {
  return (
    <AuthenticationFrame>
      <RoleFrame
        requiredRole={'root:access'}
        useNotFound={true}
      >
        <div className={'grid grid-cols-[auto_auto_1fr] w-full'}>
          <Stack className={'w-[50px] hover:w-[150px] overflow-x-clip transition-all duration-75'}>
            <NavigationButton to={'/root/home'} icon={HomeIcon}>홈</NavigationButton>
            <NavigationButton to={'/root/school'} icon={SchoolIcon}>학교</NavigationButton>
            <NavigationButton to={'/root/sv'} icon={SchoolCapIcon}>재학생 확인</NavigationButton>
            <NavigationButton to={'/root/user'} icon={ProfileIcon}>사용자</NavigationButton>
          </Stack>
          <Stack className={'w-[150px]'}>
            <Routes>
              <Route path={'/school/*'} element={<SchoolNav/>}/>
              <Route path={'/sv/*'} element={<SvNav/>}/>
              <Route path={'/user/*'} element={<UserNav/>}/>
            </Routes>
          </Stack>
          <div className={'pl-5 pr-8'}>
            <Routes>
              <Route path={'/sv'} element={<SvList/>}/>
              <Route path={'/sv/list'} element={<SvList/>}/>
              <Route path={'/sv/approve'} element={<SvApprove/>}/>
              <Route path={'/school'} element={<SchoolManagement/>}/>
              <Route path={'/school/db'} element={<SchoolManagement/>}/>
              <Route path={'/user'} element={<UserManagement/>}/>
              <Route path={'/user/manage'} element={<UserManagement/>}/>
              <Route path={'*'} element={<Root404/>}/>
            </Routes>
          </div>
        </div>
      </RoleFrame>
    </AuthenticationFrame>
  );
}

export default CoreRoot;

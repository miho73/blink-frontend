import RoleFrame from "../Frames/RoleFrame.tsx";
import AuthenticationFrame from "../Frames/AuthenticationFrame.tsx";
import Stack from "../layout/Stack.tsx";
import {Link, Route, Routes} from "react-router-dom";
import SchoolManagement from "./SchoolManagement.tsx";
import {ReactNode} from "react";
import {SchoolNav, SvNav} from "./navigation/NavigationLinks.tsx";
import {HomeIcon, ProfileIcon, SchoolCapIcon, SchoolIcon, Svg} from "../../assets/svgs/svg.tsx";
import SvList from "./sv/SvList.tsx";
import SvApprove from "./sv/SvApprove.tsx";

function CoreRoot() {
  return (
    <AuthenticationFrame>
      <RoleFrame
        requiredRole={'blink:admin'}
        useNotFound={true}
      >
        <div className={'grid grid-cols-[auto_auto_1fr] w-full'}>
          <Stack className={'w-[50px] hover:w-[150px] overflow-x-clip'}>
            <NavigationButton to={'/root/home'} icon={HomeIcon}>홈</NavigationButton>
            <NavigationButton to={'/root/school'} icon={SchoolIcon}>학교</NavigationButton>
            <NavigationButton to={'/root/sv'} icon={SchoolCapIcon}>재학생 확인</NavigationButton>
            <NavigationButton to={'/root/user'} icon={ProfileIcon}>사용자</NavigationButton>
          </Stack>
          <Stack className={'w-[150px]'}>
            <Routes>
              <Route path={'/school/*'} element={<SchoolNav/>}/>
              <Route path={'/sv/*'} element={<SvNav/>}/>
            </Routes>
          </Stack>
          <div className={'pl-5 pr-8'}>
            <Routes>
              <Route path={'/sv/list'} element={<SvList/>}/>
              <Route path={'/sv/approve'} element={<SvApprove/>}/>
              <Route path={'/school/db'} element={<SchoolManagement/>}/>
            </Routes>
          </div>
        </div>
      </RoleFrame>
    </AuthenticationFrame>
  );
}

interface NavigationButtonProps {
  to: string;
  children: ReactNode;
  icon: string
}

function NavigationButton(props: NavigationButtonProps) {
  return (
    <Link
      className={
        'transition text-grey-900 hover:bg-grey-200 ' +
        'dark:text-grey-50 dark:hover:bg-grey-800 ' +
        'rounded-r-full text-left ' +
        'flex justify-start items-center ' +
        'whitespace-nowrap'
      }
      to={props.to}
    >
      <Svg src={props.icon} className={'w-[50px] p-[12px]'} css cssColor={'white'}/>
      {props.children}
    </Link>
  );
}

export default CoreRoot;

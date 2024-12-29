import {useAppSelector} from "../../modules/hook/ReduxHooks.ts";
import {ReactNode} from "react";
import ErrorPage from "../error/ErrorPage.tsx";
import NotFound from "../error/NotFound.tsx";

interface RoleFrameProps {
  children: ReactNode;
  requiredRole: string;
  useNotFound?: boolean;
}

function RoleFrame(props: RoleFrameProps) {
  const role = useAppSelector(state => state.userInfoReducer.role);

  if (role.includes(props.requiredRole)) {
    return props.children;
  } else {
    if (props.useNotFound) {
      return (<NotFound/>);
    } else {
      return (
        <ErrorPage
          errorCode={403}
          errorTitle={'Forbidden'}
          errorMessage={'이 페이지에 접근할 권한이 없습니다.'}
        />
      );
    }
  }
}

export default RoleFrame;

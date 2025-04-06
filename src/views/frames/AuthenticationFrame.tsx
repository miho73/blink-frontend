import {useNavigate} from 'react-router-dom';
import {useAppSelector} from "../../modules/hook/ReduxHooks.ts";
import {ReactElement, useEffect} from "react";
import {loadApplication} from "../../modules/authorize.ts";
import {useDispatch} from "react-redux";
import {actions as UserReduxActions} from "../../modules/redux/UserInfoReducer.ts";
import {actions as SchoolReduxActions, SchoolReduxState} from "../../modules/redux/SchoolReducer.ts";
import {XOR} from "../../modules/logic.ts";

interface AuthenticationFrameProps {
  children?: ReactElement | string;
  reverse?: boolean;
  to?: string;
}

function AuthenticationFrame(props: AuthenticationFrameProps) {
  const userInfo = useAppSelector(state => state.userInfoReducer);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // if user information is already initialized, return
    if (userInfo.initialized) return;

    // try load jwt from local storage
    loadApplication().then(credential => {
      dispatch(UserReduxActions.signIn(credential.userSignIn));
      dispatch(SchoolReduxActions.loadSchool(credential.schoolState));
    }).catch(() => {
      dispatch(UserReduxActions.completeInitialization(false));
      dispatch(SchoolReduxActions.setState(SchoolReduxState.ERROR));
    });
  }, [dispatch, userInfo.authenticated, userInfo.initialized]);

  if (userInfo.initialized && XOR(userInfo.authenticated, props.reverse)) {
    return (props.children);
  } else if (!userInfo.initialized) {
    return (
      <div className={'w-full h-full flex justify-center items-center'}>
        <p>LOADING</p>
      </div>
    )
  } else {
    navigate(props.to || '/auth');
  }
}

export default AuthenticationFrame;

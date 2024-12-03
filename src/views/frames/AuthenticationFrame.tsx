import {useNavigate} from 'react-router-dom';
import {useAppSelector} from "../../modules/hook/ReduxHooks.ts";
import {ReactElement, useEffect} from "react";
import {loadCredential} from "../../modules/authorize.ts";
import {useDispatch} from "react-redux";
import {actions} from "../../modules/redux/UserInfoReducer.ts";
import {NXOR, XOR} from "../../modules/logic.ts";

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
    if (userInfo.initialized) return;

    loadCredential().then(credential => {
      dispatch(actions.signIn(credential));
    }).catch(() => {
      dispatch(actions.completeInitialization(false));
    });
  }, [dispatch, userInfo.authenticated, userInfo.initialized]);

  if (userInfo.initialized && NXOR(userInfo.authenticated, props.reverse)) {
    navigate(props.to || '/auth');
    return null;
  }

  if (userInfo.initialized && XOR(userInfo.authenticated, props.reverse)) {
    return (props.children);
  } else if (!userInfo.initialized) {
    return (
      <div className={'w-full h-full flex justify-center items-center'}>
        <p>인증중</p>
      </div>
    )
  }
}

export default AuthenticationFrame;

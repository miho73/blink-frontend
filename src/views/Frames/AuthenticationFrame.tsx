import {useNavigate} from 'react-router-dom';
import {useAppSelector} from "../../modules/hook/ReduxHooks.ts";
import {ReactElement, useEffect, useState} from "react";
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

  const [done, setDone] = useState<boolean>(false);
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo.initialized && userInfo.authenticated) {
      setAuthenticated(true);
      setDone(true)
      return;
    } else if (userInfo.initialized && !userInfo.authenticated) {
      setAuthenticated(false);
      setDone(true);
      return
    }

    loadCredential().then(credential => {
      dispatch(actions.signIn(credential));
      setAuthenticated(true);
    }).catch(() => {
      dispatch(actions.completeInitialization(false));
      setAuthenticated(false);
    }).finally(() => {
      setDone(true);
    });
  }, [dispatch, userInfo.authenticated, userInfo.initialized]);

  if (done && NXOR(authenticated, props.reverse)) {
    navigate(props.to || '/auth');
    return null;
  }

  if (done && XOR(authenticated, props.reverse)) {
    return (props.children);
  } else if (!done) {
    return (
      <div className={'w-full h-full flex justify-center items-center'}>
        <p>인증중</p>
      </div>
    )
  }
}

export default AuthenticationFrame;

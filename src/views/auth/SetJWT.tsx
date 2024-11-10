import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useDispatch} from "react-redux";
import ErrorPage from "../error/ErrorPage.tsx";
import {actions} from "../../modules/redux/UserInfoReducer.ts";

function getUserInfo(jwt: string) {
  return axios.get('/api/user/get',
    {headers: {'Authorization': `Bearer ${jwt}`}});
}

function SetJwt() {
  const queryParams = new URLSearchParams(window.location.search);
  const jwt = queryParams.get("jwt");
  const navigate = useNavigate();

  const [status, setStatus] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    if (jwt == null) {
      setStatus(1);
      return;
    }

    axios.post('/api/auth/authorization',
      {},
      {headers: {'Authorization': `Bearer ${jwt}`}}
    ).then(response => {
      if (response.data['authorized'] == true) {
        getUserInfo(jwt)
          .then(response => {
            const user = response.data;
            dispatch(actions.signIn({
                username: user['user']['username'],
                jwt: jwt,
                authenticated: true,
                initialized: true
              })
            );

            localStorage.setItem('with-authentication', jwt);
            navigate('/');
          }).catch(() => {
          setStatus(3);
        });
      } else {
        setStatus(2);
      }
    }).catch(() => {
      setStatus(2);
    });
  }, [dispatch, jwt, navigate]);

  switch (status) {
    case 0:
      return (
        <div className={'flex justify-center items-center w-full h-full'}>
          <p>Signing in...</p>
        </div>
      )
    case 1:
      return (
        <ErrorPage
          errorCode={400}
          errorTitle={'Bad Request'}
          errorMessage={'JWT query was not supplied'}
        />
      )
    case 2:
      return (
        <ErrorPage
          errorCode={401}
          errorTitle={'Unauthorized'}
          errorMessage={'JWT is invalid and will not be used'}
        />
      )
    case 3:
      return (
        <ErrorPage
          errorCode={500}
          errorTitle={'Internal Server Error'}
          errorMessage={'Failed to retrieve user information'}
        />
      )
  }
}

export default SetJwt;

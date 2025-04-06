import axios from "axios";
import {UserSignInType} from "./redux/UserInfoReducer.ts";
import {SchoolReduxState, SchoolStateType} from "./redux/SchoolReducer.ts";

interface ApplicationData {
  userSignIn: UserSignInType;
  schoolState: SchoolStateType;
}

async function loadApplication(): Promise<ApplicationData> {
  const jwt: string | null = localStorage.getItem('blk-authentication');

  if (jwt == null) throw new Error();

  const authResponse = await axios.post(
    '/api/auth/authorization',
    {},
    {headers: {'Authorization': `Bearer ${jwt}`}}
  );
  if (authResponse.data['authorized'] == false) throw new Error();

  const userInfoResponse = await axios.get(
    '/api/user',
    {headers: {'Authorization': `Bearer ${jwt}`}}
  );
  const userInfo: UserSignInType = {
    username: userInfoResponse.data['user']['username'],
    jwt: jwt,
    authenticated: true,
    initialized: true,
  };

  const schoolResponse = await axios.get(
    '/api/user/sv',
    {headers: {'Authorization': `Bearer ${jwt}`}}
  );
  if (schoolResponse.data['verified'] == false) {
    return {
      userSignIn: userInfo,
      schoolState: {
        schoolUUID: null,
        schoolNeisCode: null,
        schoolName: null,
        grade: null,
        state: SchoolReduxState.NOT_VERIFIED,
      }
    };
  }
  else {
    const schoolInfo: SchoolStateType = {
      schoolUUID: schoolResponse.data['school']['schoolUUID'],
      schoolNeisCode: schoolResponse.data['school']['neisCode'],
      schoolName: schoolResponse.data['school']['name'],
      grade: schoolResponse.data['school']['grade'],
      state: schoolResponse.data['verified'] ? SchoolReduxState.VERIFIED : SchoolReduxState.NOT_VERIFIED,
    };

    return {
      userSignIn: userInfo,
      schoolState: schoolInfo,
    };
  }
}

export {
  loadApplication
}

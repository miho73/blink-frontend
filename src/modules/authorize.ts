import axios from "axios";
import {UserInfoStateType} from "./redux/UserInfoReducer.ts";

function loadCredential() {
  return new Promise((resolve: (credential: UserInfoStateType) => void, reject: () => void) => {
    const jwt: string | null = localStorage.getItem('with-authentication');

    if (jwt == null) reject();

    axios.post('/api/auth/authorization',
      {},
      {headers: {'Authorization': `Bearer ${jwt}`}}
    ).then(response => {
      if (response.data['authorized'] == true) {
        getUserInfo(<string>jwt).then(response => {
          const userInfo: UserInfoStateType = {
            username: response.data['user']['username'],
            jwt: <string>jwt,
            authenticated: true,
            initialized: true
          }
          resolve(userInfo);
        }).catch(() => {
          reject();
        });
      } else reject();
    }).catch(() => {
      reject();
    });
  });
}

function getUserInfo(jwt: string) {
  return axios.get(
    '/api/user/get',
    {headers: {'Authorization': `Bearer ${jwt}`}}
  );
}

export {
  loadCredential
}

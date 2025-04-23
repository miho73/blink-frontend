import {Hr} from "../../fragments/Hr.tsx";
import {ReactNode, useState} from "react";
import {ToolBar, ToolBarButton, ToolBarInput} from "../RootComponents.tsx";
import axios from "axios";
import {useAppSelector} from "../../../modules/hook/ReduxHooks.ts";
import {checkFlag} from "../../../modules/formValidator.ts";
import Alert from "../../form/Alert.tsx";
import {ISO8601StringToDate} from "../../../modules/Datetime.ts";

interface IdentityType {
  userId: string;
  username: string;

  email: string;
  emailVerified: boolean;

  joinDate: string;
  lastLogin: string | null;

  grade: number | null;
  classroom: number | null;
  studentNumber: number | null;

  role: string[];
}

function UserManagement() {
  const jwt = useAppSelector(state => state.userInfoReducer.jwt);

  const [pageState, setPageState] = useState<number>(0);
  const [identities, setIdentities] = useState<IdentityType[]>([]);
  const [selectedRow, setSelectedRow] = useState<number>(-1);

  // 검색 조건 state
  const [identityId, setIdentityId] = useState<string>('');
  const [identityName, setIdentityName] = useState<string>('');

  function searchIdentity() {
    axios.get(
      '/api/user/access',
      {
        params: {
          id: identityId,
          name: identityName
        },
        headers: {Authorization: 'Bearer ' + jwt}
      }
    ).then(res => {
      setIdentities(res.data['data']);
      setPageState(0);
    }).catch(err => {
      const error = err.response.data?.message;
      switch (error) {
        case 'Forbidden':
          setPageState(1 << 0);
          break;
        default:
          setPageState(1 << 10);
          break;
      }
    });
  }

  const rows: ReactNode[] = [];

  identities.map((identity: IdentityType, index: number) => {
    if (index === selectedRow) {
      rows.push(
        <tr
          className={
            'transition cursor-pointer bg-opacity-50 dark:!bg-opacity-50 !bg-blue-600 dark:!bg-blue-300'
          }
          onClick={() => setSelectedRow(index)}
        >
          <td>{identity.userId}</td>
          <td>{identity.username}</td>
          <td>{identity.email}</td>
          <td>{identity.emailVerified ? 'Y' : 'N'}</td>
          <td>{ISO8601StringToDate(identity.joinDate)}</td>
          {identity.lastLogin && <td>{ISO8601StringToDate(identity.lastLogin)}</td>}
          {!identity.lastLogin && <td>N/A</td>}
          {identity.grade && <td>{identity.grade}</td>}
          {!identity.grade && <td>N/A</td>}
          {identity.classroom && <td>{identity.classroom}</td>}
          {!identity.classroom && <td>N/A</td>}
          {identity.studentNumber && <td>{identity.studentNumber}</td>}
          {!identity.studentNumber && <td>N/A</td>}
          <td>{identity.role.join(', ')}</td>
        </tr>
      );
    } else {
      rows.push(
        <tr onClick={() => setSelectedRow(index)} className={'transition cursor-pointer'}>
          <td>{identity.userId}</td>
          <td>{identity.username}</td>
          <td>{identity.email}</td>
          <td>{identity.emailVerified ? 'Y' : 'N'}</td>
          <td>{ISO8601StringToDate(identity.joinDate)}</td>
          {identity.lastLogin && <td>{ISO8601StringToDate(identity.lastLogin)}</td>}
          {!identity.lastLogin && <td>N/A</td>}
          {identity.grade && <td>{identity.grade}</td>}
          {!identity.grade && <td>N/A</td>}
          {identity.classroom && <td>{identity.classroom}</td>}
          {!identity.classroom && <td>N/A</td>}
          {identity.studentNumber && <td>{identity.studentNumber}</td>}
          {!identity.studentNumber && <td>N/A</td>}
          <td>{identity.role.join(', ')}</td>
        </tr>
      );
    }
  });

  return (
    <>
      <p className={'text-xl font-bold my-3'}>Identity Databases</p>
      <Hr/>
      {checkFlag(pageState, 0) && <Alert variant={'error'}>권한이 거부되었습니다.</Alert>}
      {checkFlag(pageState, 11) && <Alert variant={'error'}>삭제 요청에 NEIS 코드가 없습니다.</Alert>}
      {checkFlag(pageState, 12) && <Alert variant={'error'}>삭제할 학교가 존재하지 않습니다.</Alert>}
      {checkFlag(pageState, 13) && <Alert variant={'error'}>학교를 삭제하지 못했습니다.</Alert>}
      {checkFlag(pageState, 14) && <Alert variant={'success'}>학교를 삭제했습니다.</Alert>}
      <ToolBar>
        <ToolBarInput
          placeholder={'UUID Equal'}
          value={identityId}
          setter={setIdentityId}
          onEnter={searchIdentity}
        />
        <ToolBarInput
          placeholder={'Name Contains'}
          value={identityName}
          setter={setIdentityName}
          onEnter={searchIdentity}
        />
        <ToolBarButton onClick={searchIdentity}>검색</ToolBarButton>
      </ToolBar>
      <div className={'table-root'}>
        <table>
          <thead>
          <tr>
            <th>KEY</th>
            <th>이름</th>
            <th>이메일</th>
            <th>이메일 인증</th>
            <th>가입 날짜</th>
            <th>마지막 로그인</th>
            <th>학년</th>
            <th>반</th>
            <th>번호</th>
            <th>role</th>
          </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    </>
  );
}

export default UserManagement;

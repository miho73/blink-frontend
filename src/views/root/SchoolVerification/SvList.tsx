import {Hr} from "../../fragments/Hr.tsx";
import {ReactNode, useState} from "react";
import {ToolBar, ToolBarButton, ToolBarInput} from "../RootComponents.tsx";
import axios from "axios";
import {useAppSelector} from "../../../modules/hook/ReduxHooks.ts";
import {Link} from "react-router-dom";
import {checkFlag} from "../../../modules/formValidator.ts";

interface SvRequest {
  verificationId: number;
  userId: number;
  requestTime: string;
  name: string;
  evidence: boolean;
  grade: number;
  state: string;
  schoolName: string;
}

function SvList() {
  const jwt = useAppSelector(state => state.userInfoReducer.jwt);
  const [data, setData] = useState<SvRequest[]>([]);
  const [name, setName] = useState<string>('');
  const [schoolName, setSchoolName] = useState<string>('');
  const [formState, setFormState] = useState<number>(0);

  function getList() {
    axios.get(
      '/api/sv/access',
      {
        headers: {'Authorization': `Bearer ${jwt}`},
        params: {
          name: name,
          schoolName: schoolName
        }
      }
    ).then(res => {
      setData(res.data['data']);
    }).catch(err => {
      const error = err.response.data?.message;
      switch (error) {
        case 'Forbidden':
          setFormState(1 << 0);
          break;
        case 'Database integrity':
          setFormState(1 << 1);
          break;
        default:
          setFormState(1 << 2);
      }
    });
  }

  const rows: ReactNode[] = [];
  data.map((sv, index) => {
    rows.push(
      <tr key={index}>
        <td><Link to={`/root/sv/approve?vid=${sv.verificationId}`}>{sv.verificationId}</Link></td>
        <td>{sv.userId}</td>
        <td>{sv.requestTime}</td>
        <td>{sv.name}</td>
        <td>{sv.evidence ? '제출' : '미제출'}</td>
        <td>{sv.grade}</td>
        <td>
          <Link to={`/root/school/db?schoolName=${sv.schoolName}`} target={'_blank'}>
            {sv.schoolName}
          </Link>
        </td>
        <td>{sv.state}</td>
      </tr>
    );
  })

  return (
    <>
      <p className={'text-xl font-bold my-3'}>재학생 확인</p>
      <Hr/>
      {checkFlag(formState, 0) && <p className={'my-2 text-red-500 dark:text-red-300'}>권한이 거부되었습니다.</p>}
      {checkFlag(formState, 1) && <p className={'my-2 text-red-500 dark:text-red-300'}>데이터베이스 무결성이 훼손되었습니다.</p>}
      {checkFlag(formState, 2) && <p className={'my-2 text-red-500 dark:text-red-300'}>재학생 확인 신청을 검색하지 못했습니다.</p>}
      <ToolBar>
        <ToolBarInput
          placeholder={'실명 Filter'}
          label={'실명 Filter'}
          value={name}
          setter={setName}
          onEnter={getList}
        />
        <ToolBarInput
          placeholder={'학교명 Filter'}
          label={'학교명 Filter'}
          value={schoolName}
          setter={setSchoolName}
          onEnter={getList}
        />

        <ToolBarButton onClick={getList}>로드</ToolBarButton>
      </ToolBar>
      <div className={'table-root'}>
        <table>
          <thead>
          <tr>
            <th>KEY</th>
            <th>사용자 ID</th>
            <th>신청 시각</th>
            <th>실명</th>
            <th>재학증명서</th>
            <th>학년</th>
            <th>학교명</th>
            <th>상태</th>
          </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    </>
  );
}

export default SvList;

import {Hr} from "../fragments/Hr.tsx";
import {ReactNode, useEffect, useState} from "react";
import {ToolBar, ToolBarButton, ToolBarInput} from "./RootComponents.tsx";
import axios from "axios";
import {useAppSelector} from "../../modules/hook/ReduxHooks.ts";
import {checkFlag} from "../../modules/formValidator.ts";
import {useSearchParams} from "react-router-dom";

interface SchoolType {
  school_id: number | null;
  school_name: string;
  school_type: string;
  neis_code: string;
  address: string;
  sex: string;
}

function SchoolManagement() {
  const jwt = useAppSelector(state => state.userInfoReducer.jwt);
  const [schoolName, setSchoolName] = useState<string>('');
  const [selectedRow, setSelectedRow] = useState<number>(999);
  const [formState, setFormState] = useState<number>(0);

  const [schoolData, setSchoolData] = useState<SchoolType[]>([]);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const sname = searchParams.get('schoolName')
    if(sname !== null) {
      setSchoolName(sname);
      searchDb(sname);
    }
  }, []);

  function searchNeis() {
    axios.get(
      '/api/school/neis/query',
      {
        params: {schoolName: schoolName},
        headers: {Authorization: 'Bearer ' + jwt}
      }
    ).then(res => {
      setSchoolData(res.data['data']);
      setFormState(0);
    }).catch(err => {
      const error = err.response.deta?.message;
      switch (error) {
        case 'Forbidden':
          setFormState(1 << 0);
          break;
        case 'School name was not given':
          setFormState(1 << 1);
          break;
        case 'NEIS API error':
          setFormState(1 << 2);
          break;
        default:
          setFormState(1 << 3);
          break;
      }
    });
  }

  function searchDb(param_school_name?: string) {
    axios.get(
      '/api/school/access',
      {
        params: {schoolName: param_school_name ? param_school_name : schoolName},
        headers: {Authorization: 'Bearer ' + jwt}
      }
    ).then(res => {
      setSchoolData(res.data['data']);
      setFormState(0);
    }).catch(err => {
      const error = err.response.data?.message;
      switch (error) {
        case 'Forbidden':
          setFormState(1 << 0);
          break;
        case 'School name was not given':
          setFormState(1 << 1);
          break;
        case 'Database integrity':
          setFormState(1 << 9);
          break;
        default:
          setFormState(1 << 10);
          break;
      }
    });
  }

  function deleteAll() {
    axios.delete(
      '/api/school/access',
      {
        headers: {
          Authorization: 'Bearer ' + jwt,
          'School-Uid': schoolData[selectedRow].neis_code
        }
      }
    ).then(() => {
      setFormState(1 << 14);
    }).catch(err => {
      const error = err.response.data?.message;
      switch (error) {
        case 'Forbidden':
          setFormState(1 << 0);
          break;
        case 'NEIS code was not given':
          setFormState(1 << 11);
          break;
        case 'School not found':
          setFormState(1 << 12);
          break;
        default:
          setFormState(1 << 13);
          break;
      }
    });
  }

  function addSchool() {
    if(schoolData.length <= selectedRow) {
      setFormState(1 << 4);
      return;
    }
    const school = schoolData[selectedRow];

    axios.post(
      '/api/school/access',
      {
        school_name: school.school_name,
        school_type: school.school_type,
        neis_code: school.neis_code,
        address: school.address,
        sex: school.sex
      },
      {headers: {Authorization: 'Bearer ' + jwt}}
    ).then(() => {
      setFormState(1 << 7);
    }).catch(err => {
      if(err.status === 400) {
        setFormState(1 << 6);
        return;
      }

      const error = err.response.data?.message;
      switch (error) {
        case 'Forbidden':
          setFormState(1 << 0);
          break;
        case 'School already exists':
          setFormState(1 << 8);
          break;
        default:
          setFormState(1 << 5);
          break;
      }
    });
  }

  const rows: ReactNode[] = [];

  schoolData.map((school, index) => {
    if(index === selectedRow) {
      rows.push(
        <tr
          className={
            'transition cursor-pointer bg-opacity-50 dark:!bg-opacity-50 !bg-blue-600 dark:!bg-blue-300'
          }
          onClick={() => setSelectedRow(index)}
        >
          {school.school_id && <td>{school.school_id}</td>}
          {!school.school_id && <td>N/A</td>}
          <td>{school.school_name}</td>
          <td>{school.school_type}</td>
          <td>{school.neis_code}</td>
          <td>{school.address}</td>
          <td>{school.sex}</td>
        </tr>
      );
    }
    else {
      rows.push(
        <tr onClick={() => setSelectedRow(index)} className={'transition cursor-pointer'}>
          {school.school_id && <td>{school.school_id}</td>}
          {!school.school_id && <td>N/A</td>}
          <td>{school.school_name}</td>
          <td>{school.school_type}</td>
          <td>{school.neis_code}</td>
          <td>{school.address}</td>
          <td>{school.sex}</td>
        </tr>
      );
    }
  });

  return (
    <>
      <p className={'text-xl font-bold my-3'}>학교 데이터베이스</p>
      <Hr/>
      {checkFlag(formState, 0) && <p className={'my-2 text-red-500 dark:text-red-300'}>권한이 거부되었습니다.</p>}
      {checkFlag(formState, 1) && <p className={'my-2 text-red-500 dark:text-red-300'}>학교명이 주어지지 않았습니다.</p>}
      {checkFlag(formState, 2) && <p className={'my-2 text-red-500 dark:text-red-300'}>NEIS API를 정상적으로 호출하지 못했습니다.</p>}
      {checkFlag(formState, 3) && <p className={'my-2 text-red-500 dark:text-red-300'}>학교 정보를 NEIS에서 받아오지 못했습니다.</p>}
      {checkFlag(formState, 4) && <p className={'my-2 text-red-500 dark:text-red-300'}>추가할 학교를 선택해주세요.</p>}
      {checkFlag(formState, 5) && <p className={'my-2 text-red-500 dark:text-red-300'}>학교를 추가하지 못했습니다.</p>}
      {checkFlag(formState, 6) && <p className={'my-2 text-red-500 dark:text-red-300'}>학교 정보가 잘못되었습니다.</p>}
      {checkFlag(formState, 7) && <p className={'my-2 text-green-500 dark:text-green-300'}>학교를 추가했습니다.</p>}
      {checkFlag(formState, 8) && <p className={'my-2 text-red-500 dark:text-red-300'}>해당 학교가 이미 데이터베이스에 저장되어있습니다.</p>}
      {checkFlag(formState, 9) && <p className={'my-2 text-red-500 dark:text-red-300'}>데이터베이스 무결성이 훼손되었습니다.</p>}
      {checkFlag(formState, 10) && <p className={'my-2 text-red-500 dark:text-red-300'}>데이터베이스에서 학교를 검색하지 못했습니다.</p>}
      {checkFlag(formState, 11) && <p className={'my-2 text-red-500 dark:text-red-300'}>삭제 요청에 NEIS 코드가 없습니다.</p>}
      {checkFlag(formState, 12) && <p className={'my-2 text-red-500 dark:text-red-300'}>삭제할 학교가 존재하지 않습니다.</p>}
      {checkFlag(formState, 13) && <p className={'my-2 text-red-500 dark:text-red-300'}>학교를 삭제하지 못했습니다.</p>}
      {checkFlag(formState, 14) && <p className={'my-2 text-green-500 dark:text-green-300'}>학교를 삭제했습니다.</p>}
      <ToolBar>
        <ToolBarInput
          placeholder={'학교명'}
          value={schoolName}
          setter={setSchoolName}
          onEnter={searchNeis}
          onMetaEnter={searchDb}
        />
        <ToolBarButton onClick={searchNeis}>검색</ToolBarButton>
        <ToolBarButton onClick={() => searchDb(schoolName)}>데이터베이스 검색</ToolBarButton>
        <ToolBarButton onClick={addSchool}>추가</ToolBarButton>
        <ToolBarButton onClick={deleteAll}>삭제</ToolBarButton>
      </ToolBar>
      <div className={'table-root'}>
        <table>
          <thead>
            <tr>
              <th>KEY</th>
              <th>학교명</th>
              <th>학교급</th>
              <th>NEIS 코드</th>
              <th>주소</th>
              <th>성별</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    </>
  )
}

export default SchoolManagement;

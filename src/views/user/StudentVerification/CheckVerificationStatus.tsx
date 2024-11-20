import Stack from "../../layout/Stack.tsx";
import {Hr} from "../../fragments/Hr.tsx";
import {Button} from "../../form/Button.tsx";
import {useEffect, useState} from "react";
import axios from "axios";
import {useAppSelector} from "../../../modules/hook/ReduxHooks.ts";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import {checkFlag} from "../../../modules/formValidator.ts";
import Alert from "../../form/Alert.tsx";
import Dialog from "../../fragments/Dialog.tsx";
import {Link} from "react-router-dom";

interface request {
  vid: number;
  doc_code: string;
  evidence_type: number;
  examined_at: string | null;
  requested_at: string;
  grade: number;
  name: string;
  school: string;
  state: number;
}

const stateLookup = [
  '재학증명서 미제출',
  '확인중',
  '보류',
  '승인',
  '거절(재학증명서)',
  '거절(개인정보 불일치)',
  '거절(유효하지 않은 재학증명)',
  '거절'
]

function CheckVerificationStatus() {
  const jwt = useAppSelector(state => state.userInfoReducer.jwt);

  const [requests, setRequests] = useState<request[]>([]);
  const [formState, setFormState] = useState<number>(0);

  function reload() {
    axios.get(
      '/api/sv/request',
      {headers: {'Authorization': `Bearer ${jwt}`}}
    ).then(res => {
      if(res.data.requests.length === 0) {
        setFormState(1 << 1);
      }
      else setRequests(res.data.requests);
    }).catch(() => {
      setFormState(1 << 0);
    });
  }

  useEffect(() => {
    axios.get(
      '/api/sv/request',
      {headers: {'Authorization': `Bearer ${jwt}`}}
    ).then(res => {
      if(res.data.requests.length === 0) {
        setFormState(1 << 1);
      }
      else setRequests(res.data.requests);
    }).catch(() => {
      setFormState(1 << 0);
    });
  }, [jwt]);


  return (
    <div className={'w-full px-5 sm:w-3/4 lg:w-1/2 pt-3 mx-auto'}>
      <Stack direction={'row'} className={'gap-4'}>
        <p className={'!text-5xl logo'}>BLINK</p>
        <p className={'text-2xl font-bold my-3'}>재학생 확인 조회</p>
      </Stack>
      <Hr/>
      {formState === 0 &&
        <div className={'table-root'}>
          <table className={'no-stripe'}>
            <thead>
            <tr>
              <th>신청 번호</th>
              <th>상태</th>
              <th>신청 시각</th>
              <th>신청 정보</th>
            </tr>
            </thead>
            <tbody>
            {requests.map((req, idx) => {
              return (
                <RequestTr key={idx} {...req} reload={reload}/>
              )
            })}
            </tbody>
          </table>
        </div>
      }
      {checkFlag(formState, 1) &&
        <Alert variant={'info'}>
          <p className={'text-sky-900'}>아직 재학생 확인 신청 내역이 없습니다.</p>
          <p className={'text-sky-900'}>새 신청은 <Link className={'text-sky-900 hover:underline'} to={'/user/student-verification'}>이곳</Link>에서 제출할 수 있습니다.</p>
        </Alert>
      }
      {checkFlag(formState, 0) &&
        <Alert variant={'error'}>재학생 확인 내역을 로딩하지 못했습니다.</Alert>
      }
    </div>
  );
}

function RequestTr(props: request & { reload: () => void }) {
  const jwt = useAppSelector(state => state.userInfoReducer.jwt);

  const [open, setOpen] = useState<boolean>(false);
  const [formState, setFormState] = useState<number>(0);
  const [working, setWorking] = useState<boolean>(false);
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);

  let state = (<td className={'text-red-700 dark:text-red-300 font-bold'}>알 수 없음</td>);
  if (props.state === 0) state = (<td className={'text-orange-700 dark:text-orange-300 font-bold'}>재학증명서 미제출</td>);
  else if (props.state === 1) state = (<td className={'font-bold'}>확인중</td>);
  else if (props.state === 2) state = (<td className={'text-yellow-700 dark:text-yellow-300 font-bold'}>보류</td>);
  else if (props.state === 3) state = (<td className={'text-green-700 dark:text-green-300 font-bold'}>승인</td>);
  else if (props.state === 4) state = (<td className={'text-red-700 dark:text-red-300 font-bold'}>거절(재학증명서)</td>);
  else if (props.state === 5) state = (<td className={'text-red-700 dark:text-red-300 font-bold'}>거절(개인정보 불일치)</td>);
  else if (props.state === 6) state = (
    <td className={'text-red-700 dark:text-red-300 font-bold'}>거절(유효하지 않은 재학증명)</td>);
  else if (props.state === 7) state = (<td className={'text-red-700 dark:text-red-300 font-bold'}>거절</td>);

  const requestTime = new Date(Date.parse(props.requested_at));
  const examineTime = props.examined_at ? new Date(Date.parse(props.examined_at)) : null;

  const rT = `${requestTime.getFullYear()}/${String(requestTime.getMonth()).padStart(2, '0')}/${String(requestTime.getDate()).padStart(2, '0')} ${String(requestTime.getHours()).padStart(2, '0')}:${String(requestTime.getMinutes()).padStart(2, '0')}:${String(requestTime.getSeconds()).padStart(2, '0')}`;
  const eT = examineTime ? `${examineTime.getFullYear()}/${String(examineTime.getMonth()).padStart(2, '0')}/${String(examineTime.getDate()).padStart(2, '0')} ${String(examineTime.getHours()).padStart(2, '0')}:${String(examineTime.getMinutes()).padStart(2, '0')}:${String(examineTime.getSeconds()).padStart(2, '0')}` : 'N/A';

  const {executeRecaptcha} = useGoogleReCaptcha();

  async function checkRecaptcha() {
    if (!executeRecaptcha) {
      throw new Error('recaptcha not ready');
    }
    return await executeRecaptcha('sv/delete');
  }

  function completeRecaptcha(idx: number) {
    setWorking(true);
    checkRecaptcha()
      .then(token => {
        cancel(token, idx);
      }).catch(() => {
        setFormState(1 << 0);
        setWorking(false);
        setDeleteDialog(false);
      });
  }

  function cancel(token: string, idx: number) {
    axios.delete(
      '/api/sv/request',
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Resource-Id': idx,
          Recaptcha: token
        },
      },
    ).then(() => {
      props.reload();
    }).catch(err => {
      const error = err.response.data?.message;
      switch (error) {
        case 'Invalid Request':
          setFormState(1 << 1);
          break;
        case 'Abnormal':
          setFormState(1 << 2);
          break;
        case 'Recaptcha failed':
          setFormState(1 << 3);
          break;
        default:
          setFormState(1 << 4);
          break;
      }
    }).finally(() => {
      setWorking(false);
      setDeleteDialog(false);
    });
  }

  return (
    <>
      <tr className={'text-center'}>
        <td>{props.vid}</td>
        {state}
        <td>{rT}</td>
        <td>
          <Button size={'sm'} onClick={() => setOpen(!open)}>
            {open ? '닫기' : '열기'}
          </Button>
        </td>
      </tr>
      {open &&
        <tr className={'px-4 py-2'}>
          <td colSpan={4}>
            <p className={'text-lg font-medium'}>REQUEST #{props.vid}</p>
            <div className={'gap-2 my-3 grid grid-rows-8 grid-cols-2 items-center'}>
              <p>이름</p>
              <p>{props.name}</p>

              <p>학교명</p>
              <p>{props.school}</p>

              <p>학년</p>
              <p>{props.grade}학년</p>

              <p>신청 시각</p>
              <p>{rT}</p>

              <p>확인 시각</p>
              <p>{eT}</p>

              <p>재학증명서 문서확인번호</p>
              <p>{props.doc_code}</p>

              <p>진행 상태</p>
              <p>{stateLookup[props.state]}</p>

              <p>재학증명서</p>
              <div>
                {props.state === 0 && <p>미제출</p>}
                {props.state !== 0 && <p>제출됨</p>}
              </div>

              <p>신청 취소</p>
              <div>
                <Button size={'sm'} onClick={() => setDeleteDialog(true)}>신청 취소</Button>
              </div>
            </div>
            {checkFlag(formState, 0) && <p className={'text-red-500 dark:text-red-300 my-2'}>reCAPTCHA를 완료하지 못했습니다. 다시 시도해주세요.</p>}
            {checkFlag(formState, 1) && <p className={'text-red-500 dark:text-red-300 my-2'}>요청이 정상적으로 보내지지 않았습니다.</p>}
            {checkFlag(formState, 2) && <p className={'text-red-500 dark:text-red-300 my-2'}>작업이 취소되었습니다.</p>}
            {checkFlag(formState, 3) && <p className={'text-red-500 dark:text-red-300 my-2'}>사용자 보호를 위해 지금은 요청을 삭제할 수 없습니다.</p>}
            {checkFlag(formState, 4) && <p className={'text-red-500 dark:text-red-300 my-2'}>신청을 삭제하지 못했습니다.</p>}
          </td>
        </tr>
      }
      <Dialog
        open={deleteDialog}
        close={() => setDeleteDialog(false)}
        closeByBackdrop={true}
        title={'재학생 확인 신청 취소'}
      >
        <Stack className={'my-3 gap-1'}>
          <p>재학생 확인 신청을 취소합니다.</p>
          <p>재학생 확인을 받으려면 다시 신청을 제출해야합니다.</p>
        </Stack>
        <Stack direction={'row'} className={'gap-2 justify-end'}>
          <Button size={'sm'} onClick={() => setDeleteDialog(false)} disabled={working}>닫기</Button>
          <Button size={'sm'} onClick={() => completeRecaptcha(props.vid)} disabled={working}>
            {working ? '신청 취소중...' : '신청 취소'}
          </Button>
        </Stack>
      </Dialog>
    </>
  )
}

export default CheckVerificationStatus;

import {useAppSelector} from "../../../modules/hook/ReduxHooks.ts";
import {useState} from "react";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import axios from "axios";
import {Button} from "../../form/Button.tsx";
import {checkFlag} from "../../../modules/formValidator.ts";
import Stack from "../../layout/Stack.tsx";
import {SvRequest} from "./CheckVerificationStatus.tsx";
import {ISO8601StringToDate} from "../../../modules/Datetime.ts";
import startRecaptcha from "../../../modules/recaptcha.ts";
import Alert from "../../form/Alert.tsx";
import Dialog from "../../fragments/Dialog.tsx";

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

function VerificationRequestRow(props: SvRequest & { reload: () => void }) {
  const {executeRecaptcha} = useGoogleReCaptcha();
  const jwt = useAppSelector(state => state.userInfoReducer.jwt);

  const [open, setOpen] = useState<boolean>(false);
  const [formState, setFormState] = useState<number>(0);
  const [working, setWorking] = useState<boolean>(false);
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);

  let state = (<td className={'text-red-600 dark:text-red-300 font-bold'}>알 수 없음</td>);
  if (props.state === 0) state = (<td className={'text-orange-600 dark:text-orange-300 font-bold'}>재학증명서 미제출</td>);
  else if (props.state === 1) state = (<td className={'font-bold'}>확인중</td>);
  else if (props.state === 2) state = (<td className={'text-orange-600 dark:text-orange-300 font-bold'}>보류</td>);
  else if (props.state === 3) state = (<td className={'text-green-600 dark:text-green-300 font-bold'}>승인</td>);
  else if (props.state === 4) state = (<td className={'text-red-600 dark:text-red-300 font-bold'}>거절(재학증명서)</td>);
  else if (props.state === 5) state = (<td className={'text-red-600 dark:text-red-300 font-bold'}>거절(개인정보 불일치)</td>);
  else if (props.state === 6) state = (
    <td className={'text-red-600 dark:text-red-300 font-bold'}>거절(유효하지 않은 재학증명)</td>);
  else if (props.state === 7) state = (<td className={'text-red-600 dark:text-red-300 font-bold'}>거절</td>);

  const rT = ISO8601StringToDate(props.requestedAt);
  const eT = props.examinedAt ? ISO8601StringToDate(props.examinedAt) : 'N/A';

  async function cancel(idx: number) {
    setWorking(true);
    try {
      const token = await startRecaptcha({executeRecaptcha}, 'sv/delete');

      axios.delete(
        '/api/sv/user/requests',
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
    } catch {
      setFormState(1 << 0);
      setWorking(false);
    }
  }

  return (
    <>
      <tr className={'text-center'}>
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
          <td colSpan={3}>
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
              <p>{props.docCode}</p>

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

            {checkFlag(formState, 0) && <Alert variant={'error'}>reCAPTCHA를 완료하지 못했습니다. 다시 시도해주세요.</Alert>}
            {checkFlag(formState, 1) && <Alert variant={'error'}>요청이 정상적으로 보내지지 않았습니다.</Alert>}
            {checkFlag(formState, 2) && <Alert variant={'error'}>작업이 취소되었습니다.</Alert>}
            {checkFlag(formState, 3) && <Alert variant={'error'}>사용자 보호를 위해 지금은 요청을 삭제할 수 없습니다.</Alert>}
            {checkFlag(formState, 4) && <Alert variant={'error'}>신청을 삭제하지 못했습니다.</Alert>}
          </td>
        </tr>
      }
      <Dialog
        isOpen={deleteDialog}
        closeOnClickBackground={true}
        confirmText={working ? '신청 취소중...' : '신청 취소'}
        cancelText={'닫기'}
        onConfirm={() => cancel(props.vid)}
        onCancel={() => setDeleteDialog(false)}
        working={working}
      >
        <Stack className={'my-3 gap-1'}>
          <p>재학생 확인 신청을 취소합니다.</p>
          <p>재학생 확인을 받으려면 다시 신청을 제출해야합니다.</p>
        </Stack>
      </Dialog>
    </>
  )
}

export default VerificationRequestRow;

import {useState} from "react";
import {useAppSelector} from "../../../../modules/hook/ReduxHooks.ts";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import axios from "axios";
import Alert from "../../../form/Alert.tsx";
import Stack from "../../../layout/Stack.tsx";
import ThemeSelector from "../../../../css/ThemeSelector.tsx";
import {CheckIconDark, CheckIconLight, Svg} from "../../../../assets/svgs/svg.tsx";
import {FormGroup} from "../../../form/Form.tsx";
import {Button} from "../../../form/Button.tsx";
import {checkFlag} from "../../../../modules/formValidator.ts";
import {Link} from "react-router-dom";
import Dialog from "../../../fragments/Dialog.tsx";

interface SchoolInfo {
  id: number;
  name: string;
  grade: number;
}

function CheckOk(props: { school: SchoolInfo | null, reload: () => void }) {
  const [formState, setFormState] = useState<number>(0);
  const [openWithdrawConfirmDialog, setOpenWithdrawConfirmDialog] = useState<boolean>(false);
  const [working, setWorking] = useState<boolean>(false);
  const jwt = useAppSelector(state => state.userInfoReducer.jwt);

  const {executeRecaptcha} = useGoogleReCaptcha();

  async function checkRecaptcha() {
    if (!executeRecaptcha) {
      throw new Error('recaptcha not ready');
    }

    return await executeRecaptcha('sv/withdraw');
  }

  function completeRecaptcha() {
    setWorking(true);
    setFormState(0);
    checkRecaptcha()
      .then(token => {
        withdraw(token);
      }).catch(() => {
      setFormState(1 << 2);
      setWorking(false);
    });
  }

  function withdraw(token: string) {
    axios.post(
      '/api/sv/user/withdraw',
      {recaptcha: token},
      {headers: {'Authorization': `Bearer ${jwt}`}}
    ).then(() => {
      props.reload();
    }).catch(err => {
      const error = err.response.data?.message;
      switch (error) {
        case 'Recaptcha failed':
          setFormState(1 << 0);
          break;
        case 'User not verified':
          setFormState(1 << 3);
          break;
        default:
          setFormState(1 << 1);
      }
    }).finally(() => {
      setWorking(false);
      setOpenWithdrawConfirmDialog(false);
    });
  }

  if (props.school == null) {
    return (
      <Alert variant={'error'}>재학생 인증이 되어있으나, 해당 학교를 찾지 못했습니다.</Alert>
    )
  }

  return (
    <>
      <Stack direction={'row'} className={'items-center gap-2'}>
        <ThemeSelector light={<Svg src={CheckIconLight}/>} dark={<Svg src={CheckIconDark} className={'w-[24px]'}/>}/>
        <p className={'text-lg font-medium text-green-700 dark:text-green-300 my-2'}>이 계정은 {props.school.name}의 재학생으로
          확인되었습니다.</p>
      </Stack>
      <FormGroup label={'학적 확인'} strong>
        <div
          className={'grid grid-cols-[150px_1fr] border px-4 py-1 rounded-sm'}>
          <p className={'py-2 border-b border-neutral-400 dark:border-neutral-600'}>학교명</p>
          <p className={'py-2 border-b border-neutral-400 dark:border-neutral-600'}>{props.school.name}</p>

          <p className={'py-2'}>학년</p>
          <p className={'py-2'}>{props.school.grade}학년</p>
        </div>
        <Button className={'w-fit mt-3'} onClick={() => setOpenWithdrawConfirmDialog(true)}>재학생 확인 철회</Button>
        {checkFlag(formState, 0) &&
          <p className={'my-2 text-red-500 dark:text-red-300'}>사용자 보호를 위해 지금은 재학생 확인을 철회할 수 없습니다.</p>}
        {checkFlag(formState, 1) && <p className={'my-2 text-red-500 dark:text-red-300'}>재학생 확인을 철회하지 못했습니다.</p>}
        {checkFlag(formState, 2) &&
          <p className={'my-2 text-red-500 dark:text-red-300'}>reCAPTCHA를 완료하지 못했습니다. 다시 시도해주세요.</p>}
        {checkFlag(formState, 3) && <p className={'my-2 text-red-500 dark:text-red-300'}>재학생 확인되지 않은 사용자입니다.</p>}
        <label className={'my-2 text-neutral-600 dark:text-neutral-400'}>전학, 자퇴, 퇴학 등의 이유로 학적이 변동된 경우 반드시 재학생 확인을 철회하고
          필요에 따라
          다시 재학생 확인을 받아야 합니다.</label>
        <ul className={'list-disc pl-8 pr-4'}>
          <li className={'my-1'}><Link to={'/user/student-verification'}
                                       className={'text-blue-600 dark:text-blue-300 hover:underline'}>재학생
            확인 신청</Link></li>
          <li className={'my-1'}><Link to={'/user/student-verification/check'}
                                       className={'text-blue-600 dark:text-blue-300 hover:underline'}>재학생 확인 결과</Link>
          </li>
        </ul>
      </FormGroup>

      <Dialog
        isOpen={openWithdrawConfirmDialog}
        onConfirm={completeRecaptcha}
        onCancel={() => setOpenWithdrawConfirmDialog(false)}
        working={working}
      >
        <p>재학생 확인을 철회할까요?</p>
        <p>더이상 BLINK에서 {props.school.name}의 학생으로 활동할 수 없습니다.</p>
        <p>BLINK를 다시 사용하려면 재학생 화인을 다시 받아야 합니다.</p>
      </Dialog>
    </>
  );
}

export default CheckOk;

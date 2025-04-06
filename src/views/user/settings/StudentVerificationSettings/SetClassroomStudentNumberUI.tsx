import {FormGroup} from "../../../form/Form.tsx";
import {TextInput} from "../../../form/TextInput.tsx";
import {useState} from "react";
import {Button} from "../../../form/Button.tsx";
import {SchoolInfo} from "./StudentCheckSettings.tsx";
import {checkFlag, rangeCheck, verifyAll} from "../../../../modules/formValidator.ts";
import {useAppSelector} from "../../../../modules/hook/ReduxHooks.ts";
import axios from "axios";
import Alert from "../../../form/Alert.tsx";

function SetClassroomStudentNumberUI(
  props: { school: SchoolInfo | null, reload: () => void }
) {
  const jwt = useAppSelector(state => state.userInfoReducer.jwt);

  const [classroom, setClassroom] = useState<number | undefined>(props.school?.classroom ? props.school.classroom : undefined);
  const [number, setNumber] = useState<number | undefined>(props.school?.studentNumber ? props.school.studentNumber : undefined);
  const [formState, setFormState] = useState<number>(0);
  const [working, setWorking] = useState(false);

  function startSettingInfo() {
    setWorking(true);

    verifyAll(
      requestSaveInfo,
      infoInvalid,

      rangeCheck(classroom ? classroom : 1, 1, 30, 0),
      rangeCheck(number ? number : 1, 1, 50, 1)
    );
  }
  function requestSaveInfo() {
    axios.patch(
      '/api/user/school',
      {
        classroom: classroom ? classroom : null,
        studentNumber: number ? number : null
      },
      {headers: {'Authorization': `Bearer ${jwt}`}}
    ).then(() => {
      setFormState(0);
      props.reload();
    }).catch(() => {
      setFormState(1 << 2);
    }).finally(() => {
      setWorking(false);
    });
  }
  function infoInvalid(flag: number) {
    setFormState(flag);
    setWorking(false);
  }

  return (
    <FormGroup label={'반, 번호 설정'} strong>
      <div className={'grid grid-cols-3 gap-x-2'}>
        <TextInput
          placeholder={'학년'}
          type={'text'}
          value={props.school?.grade ? props.school.grade + '학년' : ''}
          disabled={working}
        />
        <TextInput
          placeholder={'반'}
          type={'number'}
          value={classroom}
          setter={setClassroom}
          invalid={checkFlag(formState, 0)}
          error={'올바른 반을 입력해주세요.'}
          disabled={working}
        />
        <TextInput
          placeholder={'번호'}
          type={'number'}
          value={number}
          setter={setNumber}
          invalid={checkFlag(formState, 1)}
          error={'올바른 번호를 입력해주세요.'}
          disabled={working}
        />
      </div>
      <Button color={'accent'} className={'w-fit my-2'} onClick={startSettingInfo}>확인</Button>
      <label className={'text-caption dark:text-caption-dark'}>반, 번호 정보를 설정하면 시간표 등 학급에 맞는 정보를 제공받으실 수 있습니다. 반, 번호
        정보를 없애려면 공란으로 둔 채로 저장하면 됩니다.</label>

      { checkFlag(formState, 2) && <Alert variant={'error'}>반, 번호 정보를 저장하지 못했습니다.</Alert> }
    </FormGroup>
  );
}

export default SetClassroomStudentNumberUI;

import {FormGroup} from "../../../form/Form.tsx";
import {useEffect, useState} from "react";
import axios from "axios";
import {useAppSelector} from "../../../../modules/hook/ReduxHooks.ts";
import BorderedFrame from "../../../form/BorderedFrame.tsx";
import {Button} from "../../../form/Button.tsx";
import Stack from "../../../layout/Stack.tsx";
import {Checkbox} from "../../../form/Checkbox.tsx";
import Alert from "../../../form/Alert.tsx";
import {PageLoadingState} from "../../../../modules/StandardPageFramework.ts";
import Spinner from "../../../fragments/Spinner.tsx";

const ALLERGY_CODE = [
  '난류',
  '우유',
  '메밀',
  '땅콩',
  '대두, 콩',
  '밀',
  '고등어',
  '게',
  '새우',
  '돼지고기',
  '복숭아',
  '토마토',
  '아황산류',
  '호두',
  '닭고기',
  '쇠고기',
  '오징어',
  '조개류'
]

function AllergySettings() {
  const jwt = useAppSelector(state => state.userInfoReducer.jwt);

  const [allergies, setAllergies] = useState<number>(0);
  const [editingAllergy, setEditingAllergy] = useState(0);
  const [editing, setEditing] = useState(false);

  const [pageState, setPageState] = useState<PageLoadingState>(PageLoadingState.LOADING);
  const [working, setWorking] = useState(false);
  const [workState, setWorkState] = useState(0);

  useEffect(() => {
    axios.get(
      '/api/user/preference/allergy',
      {headers: {'Authorization': 'Bearer ' + jwt}}
    ).then(res => {
      setAllergies(res.data['allergy']);
      setEditingAllergy(res.data['allergy']);
      setPageState(1);
    }).catch(err => {
      console.error(err);
      setPageState(2);
    });
  }, []);

  function toggleEditing() {
    if (editing) {
      setWorking(true);
      axios.patch(
        '/api/user/preference/allergy',
        {allergy: editingAllergy},
        {headers: {'Authorization': 'Bearer ' + jwt}}
      ).then(res => {
        if (res.data['allergy'] === editingAllergy) {
          setAllergies(res.data['allergy']);
          setWorkState(0);
          setEditing(!editing);
        } else {
          setWorkState(1);
        }
      }).catch(() => {
        setWorkState(1);
      }).finally(() => {
        setWorking(false);
      });
    } else setEditing(!editing);
  }
  function cancelEditing() {
    setEditingAllergy(allergies);
    setEditing(false);
  }

  if(pageState === PageLoadingState.LOADING) {
    return (
      <FormGroup label={'알러지 정보'} strong>
        <Stack className={'gap-2'}>
          <BorderedFrame title={'내 알러지 정보'} className={'w-full'}>
            <Spinner size={24}/>
          </BorderedFrame>
          <Button className={'w-fit'} onClick={toggleEditing} disabled={working}>
            {editing ? '저장' : '수정'}
          </Button>
          {workState === 1 && <Alert variant={'error'}>알러지 정보를 저장하지 못했습니다.</Alert>}
          <p className={'text-neutral-600 dark:text-neutral-400'}>알러지 정보를 설정하면 매일 식단에서 내 알러지 유발 성분을 포함하고 있는 식단을 확인할 수
            있습니다.</p>
        </Stack>
      </FormGroup>
    );
  }
  else if(pageState === PageLoadingState.ERROR) {
    return (
      <FormGroup label={'알러지 정보'} strong>
        <Alert variant={'errorFill'}>알러지 정보를 불러오지 못했습니다.</Alert>
      </FormGroup>
    );
  }
  else if(pageState === PageLoadingState.SUCCESS) {
    const selectedAllergies = [];

    if (editing) {
      for (let i = 1; i <= 18; i++) {
        selectedAllergies.push(
          <Checkbox
            key={i}
            id={`allergy-${i}`}
            checked={(editingAllergy & (1 << i)) !== 0}
            toggle={() => {
              setEditingAllergy(editingAllergy ^ (1 << i));
            }}
            label={`${ALLERGY_CODE[i - 1]} (${i})`}
            disabled={working}
          />
        );
      }
    } else {
      if (allergies === 0) {
        selectedAllergies.push('설정된 알러지 유발물질이 없습니다.');
      } else {
        for (let i = 1; i <= 18; i++) {
          if (allergies & (1 << i)) {
            selectedAllergies.push(`${ALLERGY_CODE[i - 1]} (${i})`);
          }
        }
      }
    }

    return (
      <FormGroup label={'알러지 정보'} strong>
        <Stack className={'gap-2'}>
          <BorderedFrame title={'내 알러지 정보'} className={'w-full'}>
            {!editing && <p>{selectedAllergies.join(', ')}</p>}
            {editing && selectedAllergies}
          </BorderedFrame>
          <Stack direction={'row'} className={'gap-2'}>
            { !editing &&
              <Button className={'w-fit'} color={'accent'} onClick={toggleEditing} disabled={working}>수정</Button>
            }
            { editing &&
              <>
                <Button className={'w-fit'} color={'accent'} onClick={toggleEditing} disabled={working}>저장</Button>
                <Button className={'w-fit'} onClick={cancelEditing} disabled={working}>취소</Button>
              </>
            }
          </Stack>
          {workState === 1 && <Alert variant={'error'}>알러지 정보를 저장하지 못했습니다.</Alert>}
          <p className={'text-neutral-600 dark:text-neutral-400'}>알러지 정보를 설정하면 매일 식단에서 내 알러지 유발 성분을 포함하고 있는 식단을 확인할 수
            있습니다.</p>
        </Stack>
      </FormGroup>
    );
  }
}

export default AllergySettings;

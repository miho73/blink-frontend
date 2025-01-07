import {useEffect, useState} from "react";
import axios from "axios";
import {PasskeyIocnBlack, PasskeyIocnWhite, PencilIcon, Svg, TrashBinIcon} from "../../../../assets/svgs/svg.tsx";
import Stack from "../../../layout/Stack.tsx";
import ThemeSelector from "../../../../css/ThemeSelector.tsx";
import {ISO8601StringToDate} from "../../../../modules/Datetime.ts";
import {Button} from "../../../form/Button.tsx";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import startRecaptcha from "../../../../modules/recaptcha.ts";
import Alert from "../../../form/Alert.tsx";
import {checkFlag} from "../../../../modules/formValidator.ts";
import {TextInput} from "../../../form/TextInput.tsx";
import {FormGroup} from "../../../form/Form.tsx";
import {useAppSelector} from "../../../../modules/hook/ReduxHooks.ts";
import Dialog from "../../../fragments/Dialog.tsx";

interface Passkey {
  name: string;
  lastUsed: string;
  createdAt: string;
  aaguid: string;
  passkeyId: string;
}

function PasskeyRow({passkey, reload}: { passkey: Passkey, reload: () => void }) {
  const {executeRecaptcha} = useGoogleReCaptcha();
  const jwt = useAppSelector(state => state.userInfoReducer.jwt);

  const [icon, setIcon] = useState<string[]>([]);
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<number>(0);

  const [working, setWorking] = useState<boolean>(false);
  const [removalDialogOpen, setRemovalDialogOpen] = useState<boolean>(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    axios.get('/api/auth/passkey/aaguid/light/' + passkey.aaguid)
      .then(res => {
        setIcon([
          res.data['icon']['light'],
          res.data['icon']['dark']
        ]);
      }).catch(() => {
      setIcon([PasskeyIocnBlack, PasskeyIocnWhite]);
    });
  }, []);

  async function deletePasskey() {
    setWorking(true);

    try {
      const token = await startRecaptcha({executeRecaptcha}, 'passkey/delete');

      axios.delete(
        '/api/auth/passkey/' + passkey.passkeyId,
        {
          headers: {
            'Authorization': `Bearer ${jwt}`,
            Recaptcha: token
          }
        }
      ).then(() => {
        setRemovalDialogOpen(false);
        reload();
      }).catch(err => {
        const error = err.response.data?.message;
        switch (error) {
          case 'Recaptcha not found':
            setError(1 << 0);
            break;
          case 'Recaptcha verification failed':
            setError(1 << 1);
            break;
          case 'Passkey not found':
            setError(1 << 2);
            break;
          default:
            setError(1 << 3);
        }
      }).finally(() => {
        setWorking(false);
      });
    } catch {
      setError(1 << 4);
      setWorking(false);
    }
  }

  async function renamePasskey() {
    setWorking(true);

    axios.patch(
      '/api/auth/passkey/' + passkey.passkeyId,
      {'name': name},
      {headers: {'Authorization': `Bearer ${jwt}`}}
    ).then(() => {
      setRenameDialogOpen(false);
      reload();
    }).catch(err => {
      const error = err.response.data?.message;
      switch (error) {
        case 'Name not found':
          setError(1 << 10);
          break;
        case 'Name too long':
          setError(1 << 11);
          break;
        case 'Passkey not found':
          setError(1 << 2);
          break;
        default:
          setError(1 << 12);
      }
    }).finally(() => {
      setWorking(false);
    });
  }

  return (
    <>
      <Stack direction={'row'}
             className={'justify-between items-center border px-6 py-3 rounded-sm gap-3'}>
        <ThemeSelector
          light={<Svg src={icon[0]}/>}
          dark={<Svg src={icon[1]}/>}
          className={'w-[48px]'}
        />
        <Stack className={'gap-2'}>
          <p className={'font-medium text-lg md:text-xl'}>{passkey.name}</p>
          <p className={'text-sm'}>{ISO8601StringToDate(passkey.createdAt)}에 생성됨</p>
          <p
            className={'text-sm'}>{passkey.lastUsed ? `${ISO8601StringToDate(passkey.lastUsed)}에 마지막으로 사용됨` : '아직 사용되지 않음'}</p>
        </Stack>
        <Stack direction={'row'} className={'gap-1'}>
          <Button size={'custom'} className={'border-none p-2 rounded'} onClick={() => {
            setName(passkey.name);
            setRenameDialogOpen(true);
          }}>
            <Svg src={PencilIcon} className={'w-[32px]'} css cssColor={'white'}/>
          </Button>
          <Button size={'custom'} className={'border-none p-2 rounded'} onClick={() => setRemovalDialogOpen(true)}>
            <Svg src={TrashBinIcon} className={'w-[24px] m-[4px]'} css cssColor={'white'}/>
          </Button>
        </Stack>
      </Stack>

      <Dialog
        isOpen={renameDialogOpen}
        confirmText={`이름 변경`}
        cancelText={'취소'}
        onConfirm={renamePasskey}
        onCancel={() => {
          setRenameDialogOpen(false);
          setError(0);
        }}
        closeOnClickBackground={true}
        working={working}
      >
        <FormGroup label={passkey.name + '의 이름 변경'}>
          <TextInput
            placeholder={'Passkey 이름'}
            label={'Passkey 이름'}
            value={name}
            setter={(value: string) => {
              setName(value);
            }}
            invalid={checkFlag(error, 10)}
            error={'Passkey의 이름은 255자 이하로 정해주세요.'}
          />
          {checkFlag(error, 10) && <Alert variant={'error'}>요청이 잘못되었습니다.</Alert>}
          {checkFlag(error, 11) && <Alert variant={'error'}>이름이 너무 깁니다.</Alert>}
          {checkFlag(error, 2) && <Alert variant={'error'}>패스키를 찾을 수 없습니다.</Alert>}
          {checkFlag(error, 12) && <Alert variant={'error'}>패스키의 이름을 바꾸지 못했습니다.</Alert>}
        </FormGroup>
      </Dialog>

      <Dialog
        isOpen={removalDialogOpen}
        confirmText={`${passkey.name} 삭제`}
        cancelText={'취소'}
        onConfirm={deletePasskey}
        onCancel={() => {
          setRemovalDialogOpen(false);
          setError(0);
        }}
        closeOnClickBackground={true}
        working={working}
      >
        <Stack>
          <p className={'my-1'}>Passkey "{passkey.name}"을(를) 삭제할까요?</p>
          <p className={'my-1'}>더이상 이 패스키로 BLINK에 로그인할 수 없게 됩니다. 디바이스에 저장된 패스키는 별도로 삭제해야 합니다.</p>
          {checkFlag(error, 0) && <Alert variant={'error'}>요청이 잘못되었습니다.</Alert>}
          {checkFlag(error, 1) && <Alert variant={'error'}>사용자 보호를 위해 지금은 패스키를 삭제할 수 없습니다.</Alert>}
          {checkFlag(error, 2) && <Alert variant={'error'}>패스키를 찾을 수 없습니다.</Alert>}
          {checkFlag(error, 3) && <Alert variant={'error'}>패스키를 삭제하지 못했습니다.</Alert>}
          {checkFlag(error, 4) && <Alert variant={'error'}>reCAPTCHA를 완료하지 못했습니다. 다시 시도해주세요.</Alert>}
        </Stack>
      </Dialog>
    </>
  )
}

export default PasskeyRow;
export type {Passkey};

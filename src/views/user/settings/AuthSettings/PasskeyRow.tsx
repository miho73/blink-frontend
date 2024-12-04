import {useEffect, useState} from "react";
import axios from "axios";
import {PasskeyIocnBlack, PasskeyIocnWhite, PencilIcon, Svg, TrashBinIcon} from "../../../../assets/svgs/svg.tsx";
import Stack from "../../../layout/Stack.tsx";
import ThemeSelector from "../../../../css/ThemeSelector.tsx";
import {ISO8601StringToDate} from "../../../../modules/Datetime.ts";
import {Button} from "../../../form/Button.tsx";
import Dialog from "../../../fragments/Dialog.tsx";

interface Passkey {
  name: string;
  lastUsed: string;
  createdAt: string;
  aaguid: string;
}

function PasskeyRow({passkey}: {passkey: Passkey}) {
  const [icon, setIcon] = useState<string[]>([]);
  const [deletePasskeyOpen, setDeletePasskeyOpen] = useState<boolean>(false);

  useEffect(() => {
    axios.get('/api/auth/passkey/aaguid/light/'+passkey.aaguid)
      .then(res => {
        setIcon([
          res.data['icon']['light'],
          res.data['icon']['dark']
        ]);
      }).catch(() => {
      setIcon([PasskeyIocnBlack, PasskeyIocnWhite]);
    });
  }, []);
  //TODO: implement delete / rename passkey
  function deletePasskey() {

  }

  return (
    <>
      <Stack direction={'row'}
             className={'justify-between items-center border border-neutral-400 dark:border-neutral-600 px-4 py-2 rounded-2xl'}>
        <ThemeSelector
          light={<Svg src={icon[0]}/>}
          dark={<Svg src={icon[1]}/>}
          className={'w-[48px]'}
        />
        <Stack className={'gap-2'}>
          <p className={'font-medium text-lg md:text-xl'}>{passkey.name}</p>
          <p className={'text-sm'}>{ISO8601StringToDate(passkey.createdAt)}에 생성됨</p>
          <p className={'text-sm'}>{passkey.lastUsed ? `${ISO8601StringToDate(passkey.lastUsed)}에 마지막으로 사용됨` : '아직 사용되지 않음'}</p>
        </Stack>
        <Stack direction={'row'} className={'gap-1'}>
          <Button size={'custom'} className={'border-none p-2'}>
            <Svg src={PencilIcon} className={'w-[32px]'} css cssColor={'white'}/>
          </Button>
          <Button size={'custom'} className={'border-none p-2'} onClick={() => setDeletePasskeyOpen(true)}>
            <Svg src={TrashBinIcon} className={'w-[24px] m-[4px]'} css cssColor={'white'}/>
          </Button>
        </Stack>
      </Stack>

      <Dialog
        title={'Passkey 삭제'}
        open={deletePasskeyOpen}
        close={() => setDeletePasskeyOpen(false)}
        closeByBackdrop={true}
      >
        <p>Passkey "{passkey.name}"을(를) 삭제할까요?</p>
        <p>더이상 이 Passkey로 BLINK에 로그인할 수 없게 됩니다. 기기에 저장된 Passkey는 별도로 삭제해야 합니다.</p>

        <Button onClick={deletePasskey}>삭제</Button>
      </Dialog>
    </>
  )
}

export default PasskeyRow;
export type {Passkey};

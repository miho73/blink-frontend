import Stack from "../../../layout/Stack.tsx";
import {FormGroup} from "../../../form/Form.tsx";
import {AuthInfo} from "./AuthSettings.tsx";
import PasskeyRow, {Passkey} from "./PasskeyRow.tsx";

function PasskeyList(
  { authInfo, reload }: {
    authInfo: AuthInfo | undefined,
    reload: () => void
  }
) {
  if(!authInfo) {
    return null;
  }

  const passkeyList: Passkey[] = authInfo.auth.passkey;

  if(authInfo.passkey !== 0) {
    return (
      <FormGroup label={'계정에 등록된 Passkey'} strong>
        <Stack>
          {passkeyList?.map((passkey, index) => (
            <PasskeyRow key={index} passkey={passkey} reload={reload}/>
          ))}
        </Stack>
      </FormGroup>
    );
  }
  else {
    return null;
  }
}

export default PasskeyList;

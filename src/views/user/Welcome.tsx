import DocumentFrame from "../frames/DocumentFrame.tsx";
import Alert from "../form/Alert.tsx";
import {useState} from "react";
import Dialog from "../fragments/Dialog.tsx";
import {Button} from "../form/Button.tsx";
import {FormGroup, FormSection} from "../form/Form.tsx";
import {TextInput} from "../form/TextInput.tsx";
import InputGroup from "../form/InputGroup.tsx";

function WelcomeUser() {
  const [dialog, setDialog] = useState(false)
  // TODO: Write welcome letter
  return (
    <DocumentFrame>
      <Alert variant={'info'}>INFO</Alert>
      <Alert variant={'warning'}>WARN</Alert>
      <Alert variant={'error'}>ERROR</Alert>
      <Alert variant={'success'}>SUCCESS</Alert>
      <p>DEFAULT TEXT</p>
      <caption>caption</caption>

      <FormSection title={'Form Section'}>
        <FormGroup label={'TextInput'}>
          <TextInput
            placeholder={'Placeholder'}
            value={''}
            size={'lg'}
          />
          <TextInput
            placeholder={'Placeholder'}
            value={''}
            size={'md'}
          />
          <TextInput
            placeholder={'Placeholder'}
            value={''}
            size={'sm'}
          />
        </FormGroup>
        <FormGroup label={'Buttons'}>
          <Button size={'lg'}>Large Button</Button>
          <Button size={'md'}>Medium Button</Button>
          <Button size={'sm'}>Small Button</Button>
        </FormGroup>
      </FormSection>

      <InputGroup className={''}>
        <TextInput/>
        <Button/>
      </InputGroup>

      <Button onClick={() => setDialog(true)}>Open Dialog</Button>

      <Dialog
        open={dialog}
        close={() => setDialog(false)}
        closeByBackdrop={true}
        title={'타이틀'}

        okText={'확인'}
        onOk={() => setDialog(false)}
        cancelText={'취소'}
        onCancel={() => setDialog(false)}
      >
        꿈꾸고 시를 쓰면서
      </Dialog>
    </DocumentFrame>
  );
}

export default WelcomeUser;

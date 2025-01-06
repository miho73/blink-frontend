import DocumentFrame from "../frames/DocumentFrame.tsx";
import Alert from "../form/Alert.tsx";
import {Button, ButtonLink, LinkButton, TextButton} from "../form/Button.tsx";
import {FormGroup, FormSection} from "../form/Form.tsx";
import {TextArea, TextInput} from "../form/TextInput.tsx";
import InputGroup from "../form/InputGroup.tsx";
import {Caption} from "../form/Typography.tsx";
import {Hr} from "../fragments/Hr.tsx";
import Stack from "../layout/Stack.tsx";
import {Link} from "react-router-dom";
import {useDialog} from "../../modules/DialogContext.tsx";

function WelcomeUser() {
  const { showDialog, hideDialog } = useDialog();

  function ctrlDialog() {
    showDialog({
      title: 'Dialog Title',
      content: 'Dialog Content',
      confirmText: 'OK',
      closeText: 'Cancel',
      closeOnClickBackground: true,
      onConfirm: () => {
        console.log('OK');
        hideDialog();
      }
    });
  }

  // TODO: Write welcome letter
  return (
    <DocumentFrame>
      <p>DEFAULT TEXT</p>
      <Alert variant={'warning'}>WARN</Alert>
      <Alert variant={'error'}>ERROR</Alert>
      <Alert variant={'success'}>SUCCESS</Alert>
      <Alert variant={'warningFill'}>INFO</Alert>
      <Alert variant={'errorFill'}>ERROR</Alert>
      <Alert variant={'successFill'}>SUCCESS</Alert>
      <Caption>caption</Caption>

      <Hr/>

      <FormSection title={'Form Section'}>
        <FormGroup label={'TextInput'} className={'gap-2'}>
          <TextInput
            placeholder={'Placeholder'}
            value={''}
            size={'lg'}
          />
          <TextInput
            placeholder={'Placeholder'}
            value={''}
          />
          <TextInput
            placeholder={'Placeholder'}
            value={''}
            size={'sm'}
          />
        </FormGroup>

        <FormGroup label={'TextInputWithSidecar'} sidecar={
          <Button size={'sm'}>Button</Button>
        }>
          <TextInput
            placeholder={'Disabled'}
            value={''}
            disabled
          />
        </FormGroup>

        <FormGroup label={'TextArea'}>
          <Stack direction={'row'} className={'gap-2'}>
            <TextArea value={'TextArea'}/>
            <TextArea value={'Disabled Text Area'} disabled/>
          </Stack>
        </FormGroup>

        <FormGroup label={'Buttons'} className={'gap-2'}>
          <Button size={'lg'}>Large Button</Button>
          <Button size={'md'}>Medium Button</Button>
          <Button size={'sm'}>Small Button</Button>
          <Stack direction={'row'} className={'gap-2'}>
            <Button color={'default'}>Default Button</Button>
            <Button color={'default'} disabled>Default Button DSBLD</Button>
          </Stack>
          <Stack direction={'row'} className={'gap-2'}>
            <Button color={'accent'}>Accent Button</Button>
            <Button color={'accent'} disabled>Accent Button DSBLD</Button>
          </Stack>
          <Stack direction={'row'} className={'gap-2'}>
            <TextButton>Text Button</TextButton>
            <TextButton disabled>Text Button</TextButton>
          </Stack>
          <Stack direction={'row'} className={'gap-2'}>
            <TextButton color={'accent'}>Accent Text Button</TextButton>
            <TextButton color={'accent'} disabled>Accent Text Button</TextButton>
          </Stack>
          <Stack direction={'row'} className={'gap-2'}>
            <ButtonLink to={'#'}>Button Link</ButtonLink>
            <ButtonLink to={'#'} disabled>Accent Button Link DSBLD</ButtonLink>
          </Stack>
          <Stack direction={'row'} className={'gap-2'}>
            <ButtonLink color={'accent'} to={'#'}>Accent Button Link</ButtonLink>
            <ButtonLink color={'accent'} to={'#'} disabled>Accent Button Link DSBLD</ButtonLink>
          </Stack>
          <Stack direction={'row'} className={'gap-2'}>
            <LinkButton to={'#'}>Link Button</LinkButton>
            <Link to={'#'}>Link</Link>
            <Link to={'#'} className={'href-blue'}>Href Blue Link</Link>
          </Stack>
        </FormGroup>
      </FormSection>

      <InputGroup className={''}>
        <TextInput/>
        <Button>ACTIVATE</Button>
      </InputGroup>


      <Hr/>

      <p className={'p-5 border my-3'}>BORDERED</p>

      <Button onClick={ctrlDialog}>Open Dialog</Button>
    </DocumentFrame>
  );
}

export default WelcomeUser;

import {useAppSelector} from "../../modules/hook/ReduxHooks.ts";
import {ChangeEvent, useRef, useState} from "react";
import Stack from "../layout/Stack.tsx";
import DocumentFrame from "../frames/DocumentFrame.tsx";
import {Hr} from "../fragments/Hr.tsx";
import {TextArea, TextInput} from "../form/TextInput.tsx";
import {Button} from "../form/Button.tsx";
import {checkFlag} from "../../modules/formValidator.ts";

function Write() {
  const jwt = useAppSelector(state => state.userInfoReducer.jwt);
  const boardId = useAppSelector(state => state.boardReducer.boardId);
  const boardName = useAppSelector(state => state.boardReducer.boardName);
  const [pageState, setPageState] = useState<number>(0);

  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [formState, setFormState] = useState<number>(0);

  function addPost() {

  }

  return (
    <DocumentFrame>
      <Stack direction={'row'} className={'justify-between items-center'}>
        <Stack direction={'row'} className={'items-center'}>
          <p className={'text-xl font-medium'}>{boardName}</p>
        </Stack>
        <Button
          size={'sm'}
        >게시</Button>
      </Stack>

      <Hr/>

      <Stack className={'gap-3'}>
        <TextInput
          label={'제목'}
          placeholder={'제목을 입력해주세요.'}
          value={title}
          setter={setTitle}
          invalid={checkFlag(formState, 0)}
          error={'제목은 1글자 이상 512글자 이하로 입력해주세요.'}
        />
        <TextArea
          label={'내용'}
          placeholder={'내용을 입력해주세요.'}
          size={'sm'}
          value={content}
          setter={setContent}
          invalid={checkFlag(formState, 1)}
          error={'내용은 1글자 이상 10000글자 이하로 입력해주세요.'}
        />
      </Stack>
    </DocumentFrame>
  );
}

export default Write;

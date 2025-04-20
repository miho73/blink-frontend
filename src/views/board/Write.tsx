import {useAppSelector} from "../../modules/hook/ReduxHooks.ts";
import {useState} from "react";
import Stack from "../layout/Stack.tsx";
import DocumentFrame from "../frames/DocumentFrame.tsx";
import {Hr} from "../fragments/Hr.tsx";
import {TextArea, TextInput} from "../form/TextInput.tsx";
import {Button, ButtonLink} from "../form/Button.tsx";
import {checkFlag, lengthCheck, verifyAll} from "../../modules/formValidator.ts";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import Alert from "../form/Alert.tsx";

function Write() {
  const jwt = useAppSelector(state => state.userInfoReducer.jwt);
  const boardId = useAppSelector(state => state.boardReducer.boardId);
  const boardName = useAppSelector(state => state.boardReducer.boardName);
  const [working, setWorking] = useState<boolean>(false);

  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [formState, setFormState] = useState<number>(0);

  const navigate = useNavigate();

  function verifyPost() {
    setWorking(true);

    verifyAll(
      addPost,
      formInvalid,

      lengthCheck(title, 1, 512, 0),
      lengthCheck(content, 1, 10000, 1),
    );
  }

  function addPost() {
    axios.post(
      '/api/social/post',
      {
        boardId: boardId,
        title: title,
        content: content,
        image: []
      },
      {headers: {Authorization: `Bearer ${jwt}`}}
    ).then(res => {
      const postid = res.data.postId;
      navigate(`../post/${postid}`);
    }).catch(err => {
      if(err.response.status === 403) {
        setFormState(1 << 2);
      }
      else if(err.response.status === 404) {
        setFormState(1 << 3);
      }
      else {
        setFormState(1 << 4);
      }
    }).finally(() => {
      setWorking(false);
    });
  }

  function formInvalid(flag: number) {
    setFormState(flag);
    setWorking(false);
  }

  return (
    <DocumentFrame>
      <Stack direction={'row'} className={'justify-between items-center'}>
        <Stack direction={'row'} className={'items-center'}>
          <p className={'text-xl font-medium'}>{boardName}</p>
        </Stack>
        <Stack direction={'row'} className={'gap-2'}>
          <ButtonLink to={'..'} disabled={working}>&lt; {boardName ? boardName : ''}</ButtonLink>
          <Button
            color={'accent'}
            onClick={verifyPost}
            disabled={working}
          >
            게시
          </Button>
        </Stack>
      </Stack>

      <Hr/>

      <Stack className={'gap-3'}>
        <Stack>
          <TextInput
            label={'제목'}
            placeholder={'제목을 입력해주세요.'}
            value={title}
            setter={setTitle}
            invalid={checkFlag(formState, 0)}
            error={'제목은 1글자 이상 512글자 이하로 입력해주세요.'}
            disabled={working}
          />
        </Stack>
        <Stack>
          <TextArea
            label={'내용'}
            placeholder={'내용을 입력해주세요.'}
            size={'sm'}
            value={content}
            setter={setContent}
            invalid={checkFlag(formState, 1)}
            error={'내용은 1글자 이상 10000글자 이하로 입력해주세요.'}
            disabled={working}
          />
        </Stack>
      </Stack>
      { checkFlag(formState, 2) && <Alert variant={'errorFill'}>게시판에 글을 쓸 권한이 없습니다.</Alert> }
      { checkFlag(formState, 3) && <Alert variant={'errorFill'}>게시판에 글을 쓸 수 없습니다.</Alert> }
      { checkFlag(formState, 4) && <Alert variant={'errorFill'}>게시판에 글을 쓰지 못했습니다.</Alert> }
    </DocumentFrame>
  );
}

export default Write;

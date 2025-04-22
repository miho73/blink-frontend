import DocumentFrame from "../frames/DocumentFrame.tsx";
import {useEffect, useState} from "react";
import {PageLoadingState} from "../../modules/StandardPageFramework.ts";
import Stack from "../layout/Stack.tsx";
import {Button} from "../form/Button.tsx";
import {Hr} from "../fragments/Hr.tsx";
import {TextArea, TextInput} from "../form/TextInput.tsx";
import {checkFlag, lengthCheck, verifyAll} from "../../modules/formValidator.ts";
import Alert from "../form/Alert.tsx";
import {useAppSelector} from "../../modules/hook/ReduxHooks.ts";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {PostType} from "./Post.tsx";
import {deltaToDateString} from "../../modules/Datetime.ts";
import {SkeletonElement, SkeletonFrame} from "../fragments/Skeleton.tsx";

function EditPost() {
  // post의 UUID를 Route에서 받아오기
  const params = useParams();
  const postId = params.postId;

  // 인증 정보
  const jwt = useAppSelector(state => state.userInfoReducer.jwt);

  // 게시판 정보
  const boardId = useAppSelector(state => state.boardReducer.boardId);
  const boardName = useAppSelector(state => state.boardReducer.boardName);

  // loading 상태
  const [loadState, setLoadState] = useState<PageLoadingState>(PageLoadingState.LOADING);
  const [formState, setFormState] = useState<number>(0)
  const [working, setWorking] = useState<boolean>(false);

  // post 정보
  const [post, setPost] = useState<PostType>();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  // navigation
  const navigate = useNavigate();

  function beginEdit() {
    setWorking(true);

    verifyAll(
      editPost,
      formInvalid,

      lengthCheck(title, 1, 512, 0),
      lengthCheck(content, 1, 10000, 1),
    );
  }

  function editPost() {
    axios.patch(
      `/api/social/post/${postId}`,
      {
        title: title,
        content: content,
        image: []
      },
      {headers: {Authorization: `Bearer ${jwt}`}}
    ).then(() => {
      navigate(`/board/${boardId}/post/${postId}`);
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

  function back() {
    navigate(`/board/${boardId}/post/${postId}`);
  }

  useEffect(() => {
    if (!postId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(postId)) {
      setLoadState(PageLoadingState.ERROR);
    }

    axios.get(
      `/api/social/post/${postId}`,
      { headers: {Authorization: `Bearer ${jwt}`} }
    )
      .then(res => {
        setPost(res.data.post);
        setTitle(res.data.post.title);
        setContent(res.data.post.content);
        setLoadState(PageLoadingState.SUCCESS);
      })
      .catch(() => {
        setLoadState(PageLoadingState.ERROR);
      });
  }, []);

  if(loadState === PageLoadingState.LOADING) {
    return (
      <DocumentFrame>
        <SkeletonFrame>
          <Stack direction={'row'} className={'justify-between'}>
            <SkeletonElement expW={250} expH={40}/>
            <Stack direction={'row'} className={'gap-2'}>
              <Button disabled={true} onClick={back}>&lt; 게시물</Button>
              <Button
                color={'accent'}
                onClick={beginEdit}
                disabled={true}
              >
                수정
              </Button>
            </Stack>
          </Stack>
          <Hr/>
          <Stack direction={'row'} className={'divide-x gap-2'}>
            <SkeletonElement className={'w-[25%]'} expH={24}/>
            <SkeletonElement className={'w-[10%]'} expH={24}/>
            <SkeletonElement className={'w-[15%]'} expH={24}/>
          </Stack>
          <Hr/>
          <Stack className={'gap-3'}>
            <SkeletonElement className={'w-[60%]'} expH={20}/>
            <SkeletonElement className={'w-[40%]'} expH={20}/>
            <SkeletonElement className={'w-[70%]'} expH={20}/>
            <SkeletonElement className={'w-[50%]'} expH={20}/>
            <SkeletonElement className={'w-[66%]'} expH={20}/>
          </Stack>
        </SkeletonFrame>
      </DocumentFrame>
    );
  }
  else if (loadState === PageLoadingState.ERROR) {
    return (
      <DocumentFrame>
        <Stack direction={'row'} className={'justify-between items-center'}>
          <Stack direction={'row'} className={'items-center'}>
            <p className={'text-xl font-medium'}>{boardName}</p>
          </Stack>
          <Stack direction={'row'} className={'gap-2'}>
            <Button disabled={working} onClick={back}>&lt; 게시물</Button>
            <Button
              color={'accent'}
              onClick={beginEdit}
              disabled={true}
            >
              수정
            </Button>
          </Stack>
        </Stack>

        <Hr/>

        <p>게시물을 불러오지 못했습니다.</p>
      </DocumentFrame>
    );
  }
  else if(loadState === PageLoadingState.SUCCESS && post) {
    const delta = new Date().getTime() - new Date(post.writeTime).getTime();
    const uploadDelta = deltaToDateString(delta);

    return (
      <DocumentFrame>
        <Stack direction={'row'} className={'justify-between items-center'}>
          <Stack direction={'row'} className={'items-center'}>
            <p className={'text-xl font-medium'}>{boardName}</p>
          </Stack>
          <Stack direction={'row'} className={'gap-2'}>
            <Button disabled={working} onClick={back}>&lt; 게시물</Button>
            <Button
              color={'accent'}
              onClick={beginEdit}
              disabled={working}
            >
              수정
            </Button>
          </Stack>
        </Stack>

        <Hr/>

        <Stack direction={'row'} className={'divide-x'}>
          <p className={'pr-2 text-caption dark:text-caption-dark'}>{post?.schoolName}</p>
          <p className={'px-2 text-caption dark:text-caption-dark'}>{uploadDelta}</p>
          <p className={'px-2 text-caption dark:text-caption-dark'} aria-label={`업보트 ${post.upvote}개. 다운보트 ${post.downvote}개`}>▲ {post.upvote} / {post.downvote} ▼</p>
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
        { checkFlag(formState, 2) && <Alert variant={'errorFill'}>이 게시판에서 글을 수정할 수 없습니다.</Alert> }
        { checkFlag(formState, 3) && <Alert variant={'errorFill'}>게시판에 글을 쓸 수 없습니다.</Alert> }
        { checkFlag(formState, 4) && <Alert variant={'errorFill'}>게시판에 글을 쓰지 못했습니다.</Alert> }
      </DocumentFrame>
    );
  }
}

export default EditPost;

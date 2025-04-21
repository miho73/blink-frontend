import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import DocumentFrame from "../frames/DocumentFrame.tsx";
import {Hr} from "../fragments/Hr.tsx";
import Stack from "../layout/Stack.tsx";
import {useAppSelector} from "../../modules/hook/ReduxHooks.ts";
import {Button, ButtonLink} from "../form/Button.tsx";
import axios from "axios";
import {deltaToDateString} from "../../modules/Datetime.ts";
import {DownvoteIcon, Svg, UpvoteIcon} from "../../assets/svgs/svg.tsx";
import Dialog from "../fragments/Dialog.tsx";
import Alert from "../form/Alert.tsx";
import {checkFlag} from "../../modules/formValidator.ts";

interface PostType {
  postId: string;
  title: string;
  content: string;
  images: [string];
  author: boolean;
  edited: boolean;
  writeTime: string;
  schoolName: string;
  views: number;
  upvote: number;
  downvote: number;
  vote: boolean | null;
}

function Post() {
  // post의 UUID를 Route에서 받아오기
  const params = useParams();
  const postId = params.postId;

  // redux에서 로그인 된 jwt 얻기
  const jwt = useAppSelector(state => state.userInfoReducer.jwt);

  // post, board 정보
  const [post, setPost] = useState<PostType>();
  const boardId = useAppSelector(state => state.boardReducer.boardId);

  // 네비게이션
  const navigate = useNavigate();

  // 페이지의 상태
  const [pageState, setPageState] = useState<number>(0);
  const [deleteState, setDeleteState] = useState<number>(0);

  // dialog 오픈 상태
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  function vote(upvote: boolean) {
    if (!post) return;

    axios.post(
      `/api/social/post/vote`,
      {
        postId: post.postId,
        vote: upvote
      },
      { headers: {Authorization: `Bearer ${jwt}`} }
    ).then(res => {
      setPost({
        ...post,
        upvote: res.data['votes']['upvote'],
        downvote: res.data['votes']['downvote'],
        vote: res.data['votes']['vote']
      });
    });
    // TODO: handle error
  }
  function deletePost() {
    axios.delete(
      `/api/social/post/${post?.postId}`,
      { headers: {Authorization: `Bearer ${jwt}`} }
    ).then(() => {
      navigate('..');
    }).catch(err => {
      if(err.response.status === 403) {
        setDeleteState(1 << 0);
      }
      else if(err.response.status === 404) {
        setDeleteState(1 << 1);
      }
      else {
        setDeleteState(1 << 2);
      }
    });
  }

  // 초기 post 정보 로딩
  useEffect(() => {
    // postId가 설정되지 않음
    if (!postId) {
      setPageState(2);
      return;
    }

    // postId가 UUID 형태인지 검증
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(postId)) {
      setPageState(2);
      return;
    }

    axios.get(
      `/api/social/post/${postId}`,
      {headers: {Authorization: `Bearer ${jwt}`}}
    ).then(res => {
      setPost(res.data.post);
      setPageState(1);
    }).catch(() => {
      setPageState(2);
    });
  }, []);

  if (pageState === 0) {
    // TODO: Add loading skeleton
    return (
      <DocumentFrame>
        <p>Loading...</p>
      </DocumentFrame>
    );
  }
  else if (pageState === 2) {
    // TODO: provide error message
    return (
      <DocumentFrame>
        <p>Error</p>
      </DocumentFrame>
    );
  }
  else if (pageState === 1 && post) {
    const delta = new Date().getTime() - new Date(post.writeTime).getTime();
    const uploadDelta = deltaToDateString(delta);

    return (
      <DocumentFrame>
        <Stack className={'gap-2'}>
          <Stack direction={'row'} className={'divide-x'}>
            <p className={'pr-2 text-caption dark:text-caption-dark'}>{post.schoolName}</p>
            <p className={'px-2 text-caption dark:text-caption-dark'}>{uploadDelta}</p>
            { post.edited && <p className={'px-2 text-caption dark:text-caption-dark'}>수정됨</p> }
          </Stack>

          <Stack direction={'row'} className={'justify-between items-center'}>
            <p className={'text-2xl font-medium'}>{post.title}</p>
            <Stack direction={'row'} className={'gap-2'}>
              <ButtonLink to={'..'}>&lt; 목록</ButtonLink>
              {post.author &&
                <>
                  <ButtonLink color={'accent'} to={`/board/${boardId}/edit/${postId}`}>수정</ButtonLink>
                  <Button color={'accent'} onClick={() => setDeleteDialogOpen(true)}>삭제</Button>
                </>
              }
            </Stack>
          </Stack>

          <pre>
            <p>{post.content}</p>
          </pre>

          <Hr/>

          <Stack direction={'row'} className={'gap-x-3 divide-x items-center'}>
            <p>{post.views} Views</p>
            <Stack direction={'row'} className={'gap-3 items-center pl-2'}>
              <Button
                color={post.vote === true ? 'accent' : 'default'}
                className={
                  '!p-1.5 rounded-full !shadow-none'
                }
                onClick={() => vote(true)}
              >
                <Svg
                  src={UpvoteIcon}
                  css
                  cssColor={'white'}
                  className={'w-[24px] h-[24px]'}
                />
              </Button>
              <p className={'text-lg font-medium'}>{post.upvote - post.downvote}</p>
              <Button
                color={post.vote === false ? 'accent' : 'default'}
                className={
                  '!p-1.5 rounded-full !shadow-none'
                }
                onClick={() => vote(false)}
              >
                <Svg
                  src={DownvoteIcon}
                  css
                  cssColor={'white'}
                  className={'w-[24px] h-[24px]'}
                />
              </Button>
            </Stack>
          </Stack>

          {checkFlag(deleteState, 0) && <Alert variant={'errorFill'}>게시물을 지울 수 없습니다.</Alert>}
          {checkFlag(deleteState, 1) && <Alert variant={'errorFill'}>게시물을 찾지 못했습니다.</Alert>}
          {checkFlag(deleteState, 2) && <Alert variant={'errorFill'}>게시물을 지우지 못했습니다.</Alert>}
        </Stack>

        <Dialog
          isOpen={deleteDialogOpen}
          confirmText={'삭제'}
          cancelText={'취소'}
          onConfirm={deletePost}
          finally={() => setDeleteDialogOpen(false)}
        >
          <p className={'my-1'}>게시물을 삭제할까요?</p>
        </Dialog>
      </DocumentFrame>
    );
  }
}

export default Post;
export type {
  PostType
}

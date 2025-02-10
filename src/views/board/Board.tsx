import DocumentFrame from "../frames/DocumentFrame.tsx";
import Stack from "../layout/Stack.tsx";
import {ButtonLink} from "../form/Button.tsx";
import {Hr} from "../fragments/Hr.tsx";
import {useAppSelector} from "../../modules/hook/ReduxHooks.ts";
import {useEffect, useState} from "react";
import axios from "axios";
import {deltaToDateString} from "../../modules/Datetime.ts";
import {trimContent} from "../../modules/content.ts";
import {Link} from "react-router-dom";

interface SimplePostType {
  postId: string;
  title: string;
  content: string;
  edited: boolean;
  writeTime: string;
  schoolName: string;
  views: number;
  upvote: number;
  downvote: number;
}

function Board() {
  // query parameter에서 head parameter 얻어서 초기 로딩에 사용
  const queryParams = new URLSearchParams(window.location.search);
  const from: string | null = queryParams.get("from");

  // redux에서 로그인 된 jwt 얻기
  const jwt = useAppSelector(state => state.userInfoReducer.jwt);

  // redux에서 로드된 게시판 정보 얻기
  const boardName = useAppSelector(state => state.boardReducer.boardName);
  const boardId = useAppSelector(state => state.boardReducer.boardId);
  const boardState = useAppSelector(state => state.boardReducer.state);

  // 게시물 로딩 상태
  const [loading, setLoading] = useState<boolean>(false);

  // 페이지의 상태
  const [pageState, setPageState] = useState<number>(0);

  // 게시물의 리스트
  const [postList, setPostList] = useState<SimplePostType[]>([]);

  // 게시물 최초 로딩
  useEffect(() => {
    let postBeginning = null;

    // 'from' query parameter이 UUID 형태인지 검증
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(from || '')) {
      postBeginning = from;
    }

    // board가 로딩되지 않은 경우 리턴. board 로딩 없이 이 함수는 호출될 수 없음
    if (boardState !== 0) {
      return;
    }

    // 초기 포스트 로딩
    axios.get(
      `/api/social/post/list/${boardId}`,
      {
        headers: {Authorization: `Bearer ${jwt}`},
        params: {
          head: postBeginning
        }
      }
    ).then(res => {
      setPostList(res.data.posts);
      setPageState(1);
    }).catch(() => {
      setPageState(2);
    });
  }, [boardId, jwt]);

  // scroll 이벤트 받아서 리스너에 연결하는 effect. postList 업데이트마다 리스너 다시 등록
  useEffect(() => {
    window.addEventListener('scrollend', handleScroll);
    return () => {
      window.removeEventListener('scrollend', handleScroll)
    }
  }, [postList]);

  // scroll 이벤트 리스너
  const handleScroll = () => {
    const isBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 10;
    // bottom 쳤고, 초기 로딩 완료했고, 추가 포스트가 로딩중이 아니면 추가 로딩 진행
    if (isBottom && pageState === 1 && !loading) {
      setLoading(true);
      axios.get(
        `/api/social/post/list/${boardId}`,
        {
          headers: {Authorization: `Bearer ${jwt}`},
          params: {
            head: postList[postList.length - 1].postId
          }
        }
      ).then(res => {
        postList.push(...res.data.posts);
        setPostList(postList);
      }).catch(() => {
        setPageState(3);
      }).finally(() => {
        setLoading(false);
      });
    }
  };

  // pageState = 0: initial, 1: loaded, 2: post was not loaded, 3: additional post cannot be loaded
  if (pageState === 0) {
    // TODO: Add loading spinner
    return (
      <DocumentFrame>
        <p>Loading...</p>
      </DocumentFrame>
    );
  } else if (pageState === 2) {
    // TODO: provide error message
    return (
      <DocumentFrame>
        <p>Error</p>
      </DocumentFrame>
    );
  } else if (pageState === 3) {
    // TODO: provide error message
    return (
      <DocumentFrame>
        <p>Additional content cannot be loaded</p>
      </DocumentFrame>
    );
  } else {
    return (
      <DocumentFrame>
        <Stack direction={'row'} className={'justify-between'}>
          <Stack direction={'row'} className={'items-center'}>
            <p className={'text-xl font-medium'}>{trimContent(boardName || '', 20)}</p>
          </Stack>
          <Stack>
            <ButtonLink color={'accent'} to={'write'}>글쓰기</ButtonLink>
          </Stack>
        </Stack>
        <Hr/>
        <div className={'grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-none'}>
          {postList.map(post => (
            <PostCard key={post.postId} post={post}/>
          ))}
        </div>
      </DocumentFrame>
    );
  }
}

function PostCard({post}: { post: SimplePostType }) {
  const delta = new Date().getTime() - new Date(post.writeTime).getTime();

  return (
    <Link className={'px-4 py-2 block'} to={`./post/${post.postId}`}>
      <div className={'flex flex-row items-center gap-2'}>
        <p className={'font-medium'}>{post.title}</p>
        <p className={'text-xs text-neutral-600 dark:text-neutral-300'}>{post.schoolName}</p>
      </div>
      <p className={'text-sm text-neutral-600 dark:text-neutral-300'}>{trimContent(post.content, 100)}</p>
      <div className={
        'flex flex-row ' +
        'text-xs my-1 md:text-sm md:my-2 ' +
        'divide-x divide-neutral-400 dark:divide-neutral-500 '
      }>
        <p className={'px-1 text-neutral-400 dark:text-neutral-500'}>{post.upvote}/{post.downvote}</p>
        <p className={'px-1 text-neutral-400 dark:text-neutral-500'}>{deltaToDateString(delta)}</p>
      </div>
    </Link>
  );
}

export default Board;

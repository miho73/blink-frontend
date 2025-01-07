import DocumentFrame from "../frames/DocumentFrame.tsx";
import Stack from "../layout/Stack.tsx";
import {ButtonLink} from "../form/Button.tsx";
import {Hr} from "../fragments/Hr.tsx";
import {useAppSelector} from "../../modules/hook/ReduxHooks.ts";
import {useEffect, useState} from "react";
import axios from "axios";
import {deltaToDateString} from "../../modules/Datetime.ts";
import {trimContent} from "../../modules/content.ts";

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
  const jwt = useAppSelector(state => state.userInfoReducer.jwt);
  const boardName = useAppSelector(state => state.boardReducer.boardName);
  const boardId = useAppSelector(state => state.boardReducer.boardId);

  const [pageState, setPageState] = useState<number>(0);

  const [postList, setPostList] = useState<SimplePostType[]>([]);

  useEffect(() => {
    if (!boardId) {
      setPageState(3);
      return;
    }

    axios.get(
      `/api/social/post/list/${boardId}`,
      {headers: {Authorization: `Bearer ${jwt}`}}
    ).then(res => {
      setPostList(res.data.posts);
      setPageState(1);
    }).catch(() => {
      setPageState(2);
    });
  }, [boardId, jwt]);

  if (pageState === 0) {
    // TODO: Add loading spinner
    return (
      <DocumentFrame>
        <p>Loading...</p>
      </DocumentFrame>
    );
  }

  if (pageState === 2) {
    // TODO: provide error message
    return (
      <DocumentFrame>
        <p>Error</p>
      </DocumentFrame>
    );
  }

  return (
    <DocumentFrame>
      <Stack direction={'row'} className={'justify-between'}>
        <Stack direction={'row'} className={'items-center'}>
          <p className={'text-xl font-medium'}>{boardName}</p>
        </Stack>
        <Stack>
          <ButtonLink to={'write'}>글쓰기</ButtonLink>
        </Stack>
      </Stack>
      <Hr/>
      <div className={'grid grid-cols-1 sm:grid-cols-2 two-col-separator'}>
        {postList.map(post => (
          <PostCard key={post.postId} post={post}/>
        ))}
        {postList.map(post => (
          <PostCard key={post.postId} post={post}/>
        ))}
        {postList.map(post => (
          <PostCard key={post.postId} post={post}/>
        ))}
      </div>
    </DocumentFrame>
  );
}

function PostCard({post}: { post: SimplePostType }) {
  const delta = new Date().getTime() - new Date(post.writeTime).getTime();

  return (
    <div className={'px-4 my-2'}>
      <div className={'flex flex-row items-center gap-2'}>
        <p className={'font-medium'}>{post.title}</p>
        <p className={'text-xs text-neutral-600 dark:text-neutral-300'}>{post.schoolName}</p>
      </div>
      <p className={'text-sm text-neutral-600 dark:text-neutral-300'}>{trimContent(post.content)}</p>
      <div className={
        'flex flex-row ' +
        'text-xs my-1 md:text-sm md:my-2 ' +
        'divide-x divide-neutral-400 dark:divide-neutral-500 '
      }>
        <p className={'px-1 text-neutral-400 dark:text-neutral-500'}>{post.upvote}/{post.downvote}</p>
        <p className={'px-1 text-neutral-400 dark:text-neutral-500'}>{deltaToDateString(delta)}</p>
      </div>
    </div>
  );
}

export default Board;

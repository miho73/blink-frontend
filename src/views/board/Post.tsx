import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import DocumentFrame from "../frames/DocumentFrame.tsx";
import {Hr} from "../fragments/Hr.tsx";
import Stack from "../layout/Stack.tsx";
import {useAppSelector} from "../../modules/hook/ReduxHooks.ts";
import {Button, ButtonLink} from "../form/Button.tsx";
import axios from "axios";
import {deltaToDateString} from "../../modules/Datetime.ts";

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
}

function Post() {
  // post의 UUID를 Route에서 받아오기
  const params = useParams();
  const postId = params.postId;

  // redux에서 로그인 된 jwt 얻기
  const jwt = useAppSelector(state => state.userInfoReducer.jwt);

  // post 정보
  const [post, setPost] = useState<PostType>();

  // 페이지의 상태
  const [pageState, setPageState] = useState<number>(0);

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
  } else if (pageState === 2) {
    // TODO: provide error message
    return (
      <DocumentFrame>
        <p>Error</p>
      </DocumentFrame>
    );
  } else if (pageState === 1 && post) {
    const delta = new Date().getTime() - new Date(post.writeTime).getTime();
    const uploadDelta = deltaToDateString(delta);

    return (
      <DocumentFrame>
        <Stack className={'gap-2'}>
          <Stack direction={'row'} className={'divide-x'}>
            <p>{post.schoolName}</p>
            <p>{uploadDelta}</p>
          </Stack>

          <Stack direction={'row'} className={'justify-between items-center'}>
            <p className={'text-2xl font-medium'}>{post.title}</p>

            <Stack direction={'row'} className={'gap-2'}>
              <ButtonLink to={'..'}>&lt; 목록</ButtonLink>
              {post.author &&
                <>
                  <Button color={'accent'} to={'write'}>수정</Button>
                  <Button color={'accent'} to={'write'}>삭제</Button>
                </>
              }
            </Stack>
          </Stack>

          <pre>
            <p>{post.content}</p>
          </pre>
          <Hr/>
          <div>
            <p>{post.views}</p>
            <p>{post.upvote}</p>
            <p>{post.downvote}</p>
          </div>
        </Stack>
      </DocumentFrame>
    );
  }
}

export default Post;

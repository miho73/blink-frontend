import ModuleTemplate from "./ModuleTemplate.tsx";
import Stack from "../../layout/Stack.tsx";
import {StarFilledIcon, StarIcon, Svg} from "../../../assets/svgs/svg.tsx";
import {LinkButton} from "../../form/Button.tsx";
import {useEffect, useState} from "react";
import axios from "axios";
import {PageLoadingState} from "../../../modules/StandardPageFramework.ts";
import {useAppSelector} from "../../../modules/hook/ReduxHooks.ts";
import {Link} from "react-router-dom";
import {SkeletonElement, SkeletonFrame} from "../../fragments/Skeleton.tsx";

interface FeaturedBoardsProps {
  boardName: string;
  boardUUID: string;
  stared: boolean;
}

function FeaturedBoard({board, toggleStar}: { board: FeaturedBoardsProps, toggleStar: () => void }) {
  return (
    <Stack direction={'row'} className={'items-center gap-2 py-2 first:pt-0 last:pb-0'}>
      <LinkButton onClick={toggleStar}>
        {board.stared ?
          <Svg
            src={StarFilledIcon}
            className={'w-[24px] cursor-pointer'}
            css
            cssColor={'gold'}
          /> :
          <Svg
            src={StarIcon}
            className={'w-[24px] cursor-pointer'}
            css
            cssColor={'gray'}
          />
        }
      </LinkButton>
      <Link to={`/board/${board.boardUUID}`}>{board.boardName}</Link>
    </Stack>
  );
}

function FeaturedBoards() {
  const jwt = useAppSelector(state => state.userInfoReducer.jwt);

  const [featured, setFeatured] = useState<FeaturedBoardsProps[]>([]);
  const [loadState, setLoadState] = useState<PageLoadingState>(PageLoadingState.LOADING);

  function toggleStar(boardUUID: string, star: boolean) {
    axios.patch(
      '/api/user/social/board/star',
      {
        boardId: boardUUID,
        star: star
      },
      {headers: {Authorization: `Bearer ${jwt}`}}
    ).then(() => {
      const newlyFeatured = featured.map((board) => {
        if (board.boardUUID === boardUUID) {
          board.stared = star;
        }
        return board;
      });
      setFeatured(newlyFeatured);
    }).catch(e => {
      console.error(e);
    });
  }

  useEffect(() => {
    axios.get(
      '/api/user/social/board/featured',
      {headers: {Authorization: `Bearer ${jwt}`}}
    )
      .then((res) => {
        setFeatured(res.data['body']);
        setLoadState(PageLoadingState.SUCCESS);
      }).catch(() => {
        setLoadState(PageLoadingState.ERROR);
      });
  }, []);

  if (loadState === PageLoadingState.LOADING) {
    return (
      <ModuleTemplate name={'추천 게시판'} className={'col-span-2'}>
        <SkeletonFrame>
          <Stack className={'items-end gap-3'}>
            <Stack className={'divide-y w-full'}>
              <Stack direction={'row'} className={'items-center gap-2 py-2 first:pt-0 last:pb-0'}>
                <SkeletonElement expH={24} expW={24}/>
                <SkeletonElement expH={24} expW={300}/>
              </Stack>
              <Stack direction={'row'} className={'items-center gap-2 py-2 first:pt-0 last:pb-0'}>
                <SkeletonElement expH={24} expW={24}/>
                <SkeletonElement expH={24} expW={300}/>
              </Stack>
              <Stack direction={'row'} className={'items-center gap-2 py-2 first:pt-0 last:pb-0'}>
                <SkeletonElement expH={24} expW={24}/>
                <SkeletonElement expH={24} expW={300}/>
              </Stack>
            </Stack>
            <SkeletonElement expH={20} expW={104.2}/>
          </Stack>
        </SkeletonFrame>
      </ModuleTemplate>
    )
  }
  else if (loadState === PageLoadingState.ERROR) {
    return (
      <ModuleTemplate name={'추천 게시판'} className={'col-span-2'}>
        <p>게시판을 불러오지 못했습니다.</p>
      </ModuleTemplate>
    );
  }
  else if (loadState === PageLoadingState.SUCCESS) {
    return (
      <ModuleTemplate name={'추천 게시판'} className={'col-span-2'}>
        <Stack className={'items-end gap-3'}>
          <Stack className={'divide-y w-full'}>
            {featured.map((board, idx: number) => (
              <FeaturedBoard
                key={idx}
                board={board}
                toggleStar={() => toggleStar(featured[idx].boardUUID, !featured[idx].stared)}
              />
            ))}
          </Stack>

          <Link to={'/board'} className={'text-sm'}>게시판 찾아보기 &gt;</Link>
        </Stack>
      </ModuleTemplate>
    );
  }
}

export default FeaturedBoards;

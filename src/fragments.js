import { gql } from "@apollo/client";

// 가장 자주 중복되는 항목들만 fragment로 만들어서 사용
// Photo - 백엔드에 사용했던 이름과 동일해야 함
// 사용법 - ${PHOTO_FRAGMENT}로 gql안에 import 후 ...PhotoFragment로 사용
export const PHOTO_FRAGMENT = gql`
  fragment PhotoFragment on Photo {
    id
    file
    likes
    commentNumber
    isLiked
  }
`;

export const COMMENT_FRAGMENT = gql`
  fragment CommentFragment on Comment {
    id
    user {
      username
      avatar
    }
    payload
    isMine
    createdAt
  }
`;

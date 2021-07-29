import React from "react";
import PropTypes from "prop-types";
import { FatText } from "../shared";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($id: Int!) {
    deleteComment(id: $id) {
      ok
    }
  }
`;

const CommentContainer = styled.div`
  margin-bottom: 7px;
`;
const CommentCaption = styled.span`
  margin-left: 10px;
  a {
    background-color: inherit;
    color: ${(props) => props.theme.accent};
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;

function Comment({ id, photoId, isMine, author, payload }) {
  const updateDeleteComment = (cache, result) => {
    // result에서 data:{deleteComment}안에 있는 ok 가져오기
    const {
      data: {
        deleteComment: { ok },
      },
    } = result;
    if (ok) {
      cache.evict({ id: `Comment:${id}` }); //evict: 지울려는 아이디만 넣어주면 해당 cache data 삭제
      cache.modify({
        id: `Photo:${photoId}`,
        fields: {
          commentNumber(prev) {
            return prev - 1;
          },
        },
      });
    }
  };

  const [deleteCommentMutation] = useMutation(DELETE_COMMENT_MUTATION, {
    variables: {
      id,
    },
    update: updateDeleteComment,
  });
  const onDeleteClick = () => {
    deleteCommentMutation();
  };

  // 유저가 아닌 관리자가 만든 컨텐츠를 다룰 때 사용
  // sanitizeHtml: allowed~~ 로 허용할 내용(Tag, Attributes, Hostnames)을 지정 가능 // 지정하지않은 것은 clean
  // const cleanedPayload = sanitizeHtml(
  //   payload.replace(/#[\w]+/g, "<mark>$&</mark>"),
  //   {
  //     allowedTags: ["mark"],
  //   }
  // );

  return (
    <CommentContainer>
      <Link to={`/users/${author}`}>
        <FatText>{author}</FatText>
      </Link>
      <CommentCaption>
        {
          // payload를 조개서 배열로 만들기 // test를 통해서 정규식(ex:#)를 찾아서 있으면 true, 없으면 false를 이용해서
          payload.split(" ").map((word, index) =>
            /#[\w]+/.test(word) ? (
              // React.Fragment를 사용하므로서 key를 사용할 수 있음 // <>는 사용 불가능
              <React.Fragment key={index}>
                <Link to={`/hashtags/${word}`}>{word}</Link>{" "}
              </React.Fragment>
            ) : (
              <React.Fragment key={index}>{word}</React.Fragment>
            )
          )
        }
      </CommentCaption>
      {isMine ? <button onClick={onDeleteClick}>❌</button> : null}
      {/* <CommentCaption
        // dangerouslySetInnerHTML: 해당 prop는 텍스트가 아닌 html로 해석 -> <mark>를 html로 해석
        dangerouslySetInnerHTML={{
          __html: cleanedPayload,
        }}
      /> */}
    </CommentContainer>
  );
}

Comment.propTypes = {
  isMine: PropTypes.bool,
  id: PropTypes.number,
  photoId: PropTypes.number,
  author: PropTypes.string.isRequired,
  payload: PropTypes.string.isRequired,
};

export default Comment;

import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { useEffect } from "react";
import { isLoggedInVar, logUserOut } from "../apollo";

// 유저가 무엇을 주는지 기억
export const ME_QUERY = gql`
  query me {
    me {
      id
      username
      avatar
    }
  }
`;

function useUser() {
  const hasToken = useReactiveVar(isLoggedInVar); // 실제로그인x, localStorage에 로그인 했음을 확인(눈속임용 로그인)
  const { data } = useQuery(ME_QUERY, {
    skip: !hasToken, // 사용자가 LocalStorage의 토큰을 통해 로그인하지 않은 경우에는 skip
  });
  // 처음 실행 + data가 변할 떄 실행
  useEffect(() => {
    if (data?.me === null) {
      // LocalStorage에 token을 가지고 있지만 token이 Back-end에서 동작하지 않는경우 로그아웃
      logUserOut();
    }
  }, [data]);
  return { data };
}

export default useUser;

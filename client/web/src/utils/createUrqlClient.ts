import { dedupExchange, fetchExchange, stringifyVariables } from 'urql';
import { cacheExchange, Resolver } from '@urql/exchange-graphcache';
import {
  LogoutMutation,
  MeQuery,
  MeDocument,
  LoginMutation,
  RegisterMutation,
} from '../generated/graphql';
import { betterUpdateQuery } from '../pages/betterUpdateQuery';
import { pipe, tap } from 'wonka';
import { Exchange } from 'urql';
import Router from 'next/router';

const errorExchange: Exchange =
  ({ forward }) =>
  (ops$) => {
    return pipe(
      forward(ops$),
      tap(({ error }) => {
        if (error) {
          if (error?.message.includes('Not Authenticated')) {
            Router.replace('/login');
          }
        }
      })
    );
  };

// export const cursorPagination = (): Resolver => {
//   return (_parent, fieldArgs, cache, info) => {
//     const { parentKey: entityKey, fieldName } = info;
//     console.log(entityKey, fieldName)
//     const allFields = cache.inspectFields(entityKey);
//     console.log("allFields", allFields)
//     const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
//     const size = fieldInfos.length;
//     if (size === 0) {
//       return undefined;
//     }
//     console.log('hi')
//     const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`
//     const isItInTheCache = cache.resolve(cache.resolve(entityKey, fieldKey) as string, "posts")

//     info.partial  = !isItInTheCache;
//     console.log(info.partial)
//     let results: String[] = []
//     let hasMore = true;
//     fieldInfos.forEach(fi => {
//       const key = cache.resolve(entityKey, fi.fieldKey) as string;
//       const data = cache.resolve(key,"post") as string[];
//       const _hasMore = cache.resolve(key, "hasMore")
//       if(!_hasMore){
//         hasMore = _hasMore as boolean;
//       }
//       console.log("data: ", hasMore, data)
//       results.push(...data)
//     })

//     return {
//       // not needed anymore 
//       _typename: "PaginatedPosts",
//       hasMore: true,
//       posts: results
//     }
//   };
// };

export const createUrqlClient = (ssrExchange: any) => ({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include' as const,
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      keys:{
      PaginatedPosts : () => null,
      },
      resolvers: {
        Query: {
           //posts: cursorPagination(),
        },
      },
      updates: {
        Mutation: {
          createPost:(_result, _args, cache, info) => {
            
          },
          logout: (_result, _args, cache, info) => {
            betterUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              () => ({ me: null })
            );
          },
          login: (_result, args, cache, info) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return {
                    me: result.login.user,
                  };
                }
              }
            );
          },
          register: (_result, args, cache, info) => {
            betterUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.register.errors) {
                  return query;
                } else {
                  return {
                    me: result.register.user,
                  };
                }
              }
            );
          },
        },
      },
    }),
    errorExchange,
    ssrExchange,
    fetchExchange,
  ],
});

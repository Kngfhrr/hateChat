import gql from 'graphql-tag';

// export const ALL_CHATS_QUERY = gql`
//     query AllChatsQuery {
//         allChats {
//             id
//             createdAt
//             from
//             content
//
//         }
//     }
// `;
//
// export const CREATE_CHAT_MUTATION = gql`
//     mutation CreateChatMutation($content: String!, $from: String!) {
//         createChat(content: $content, from: $from,) {
//             id
//             createdAt
//             from
//             content
//         }
//     }
// `;
//
// export const DELETE_CHAT_MUTATION = gql`
//     mutation DeleteChatMutation($id: allId){
//         deleteChat(id: $allId){
//             allId
//             id
//         }
//     }
// `;

export const message = gql`
   {
user(id: 1){
  id
}
}
    `;
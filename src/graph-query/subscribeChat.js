// import gql from "graphql-tag";
//
// const subscribeToNewChats = () => {
//     this.props.allChatsQuery.subscribeToMore({
//         document: gql`
//           subscription {
//             Chat(filter: { mutation_in: [CREATED] }) {
//               node {
//                 id
//                 from
//                 content
//                 createdAt
//               }
//             }
//           }
//         `,
//         updateQuery: (previous, {subscriptionData}) => {
//             const newChatLinks = [
//                 ...previous.allChats,
//                 subscriptionData.data.Chat.node
//             ];
//             const result = {
//                 ...previous,
//                 allChats: newChatLinks
//             };
//             return result;
//         }
//     });
// };
//
// export {subscribeToNewChats};
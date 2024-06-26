export const getUserByIdQuery = (userId: string) => `query FindAllUsers {
          findAllUsers(filter: { _id: "${userId}" }) {
            data {
              _id
              fullName
              role
            }
          }
        }`;

export const getTranslatorByIdQuery = (
  translatorId: string,
) => `query FindAllTranslators {
    findAllTranslators(filter: { _id: "${translatorId}", deleted: false }) {
        data {
            _id
            available
            userId
        }
    }
}
`;

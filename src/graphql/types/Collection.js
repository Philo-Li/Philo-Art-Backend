import { gql } from 'apollo-server';
import * as yup from 'yup';

import createPaginationQuery from '../../utils/createPaginationQuery';

export const typeDefs = gql`
  type Collection {
    id: ID!
    userId: String!
    user: User!
    title: String!
    description: String
    createdAt: DateTime!
    updatedAt: DateTime
    photos(first: Int, after: String): CollectedPhotoConnection!
    photoCount: Int
    cover: String
    public: Boolean!
  }
`;

const photosArgsSchema = yup.object({
  after: yup.string(),
  first: yup
    .number()
    .min(1)
    .max(30)
    .default(30),
});

export const resolvers = {
  Collection: {
    user: async ({ userId }, args, { dataLoaders: { userLoader } }) =>
      userLoader.load(userId),
    photos: async (obj, args, { models: { CollectedPhoto } }) => {
      const normalizedArgs = await photosArgsSchema.validate(args);

      return createPaginationQuery(
        () =>
          CollectedPhoto.query().where({
            collectionId: obj.id,
          }),
        {
          orderColumn: 'createdAt',
          orderDirection: 'desc',
          first: normalizedArgs.first,
          after: normalizedArgs.after,
        },
      );
    },
    photoCount: async (
      { id },
      args,
      { dataLoaders: { collectionPhotoCountLoader } },
    ) => collectionPhotoCountLoader.load(id),
  },
};

export default {
  typeDefs,
  resolvers,
};

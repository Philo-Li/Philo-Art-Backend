import { gql } from 'apollo-server';
import * as yup from 'yup';

import createPaginationQuery from '../../utils/createPaginationQuery';

export const typeDefs = gql`
  extend type Query {
    """
    Returns paginated collected photos.
    """
    collectedPhotos(first: Int, after: String): CollectedPhotoConnection!
  }
`;

const collectedPhotosArgsSchema = yup.object({
  after: yup.string(),
  first: yup
    .number()
    .min(1)
    .max(30)
    .default(30),
});

export const resolvers = {
  Query: {
    collectedPhotos: async (obj, args, { models: { CollectedPhoto } }) => {
      const normalizedArgs = await collectedPhotosArgsSchema.validate(args);

      return createPaginationQuery(() => CollectedPhoto.query(), {
        orderColumn: 'createdAt',
        orderDirection: 'desc',
        first: normalizedArgs.first,
        after: normalizedArgs.after,
      });
    },
  },
};

export default {
  typeDefs,
  resolvers,
};

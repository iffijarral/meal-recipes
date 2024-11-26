import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";
import { FileUpload } from "graphql-upload/processRequest.mjs";

export const typeDefs = `#graphql
  scalar Upload
  
  type Image {    
    filename: String!
  }

  type Query {
    images: [Image!]
  }
  
  type Mutation {
    uploadImage(image: Upload!): Image!
  }
`;

// Define the Image interface
interface Image {  
  filename: string;
}

// Mocked in-memory database
const images: Image[] = [];

// Define resolvers
export const resolvers = {
  // Scalar for handling file uploads
  Upload: GraphQLUpload,

  // Query resolver to fetch all images
  Query: {
    images: (): Image[] => images, // Return the list of uploaded images
  },

  // Mutation resolver to handle file uploads
  Mutation: {
    uploadImage: async (
      _: unknown,
      { image }: { image: Promise<FileUpload> } // Arguments with typing
    ): Promise<Image> => {
      // Resolve the FileUpload promise
      const { filename, createReadStream } = await image;

      console.log(`Uploading ${filename}...`);

      // Read the file stream (placeholder for actual file storage logic)
      const stream = createReadStream();
      stream.on("data", (chunk) => console.log("Processing chunk:", chunk));
      stream.on("end", () => console.log(`${filename} upload complete.`));

      // Add the new image to the in-memory database
      const newImage: Image = { filename };
      images.push(newImage);

      // Return the uploaded image metadata
      return newImage;
    },
  },
};

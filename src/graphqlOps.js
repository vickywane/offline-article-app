import {gql} from "@apollo/client";

export const RECORDING_QUERY = gql`
    query fetchRecords {
        recordings {
            _id
            createdBy
            dateCreated
            file_link
            name
        }
    }
`;

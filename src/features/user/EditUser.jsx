import { useParams } from 'react-router-dom';
import { useGetUserQuery } from './userApiSlice';

const EditUser = () => {
  const { id } = useParams();

  const { data } = useGetUserQuery(id);

  const content = (
    <div>
      {/* <p>{data.email}</p>
      <p>{data.name}</p>
      <p>{data.createdAt}</p> */}
    </div>
  );

  return content;
};

export default EditUser;

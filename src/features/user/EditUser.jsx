import { useParams } from 'react-router-dom';
import { useGetUserQuery } from './userApiSlice';

const EditUser = () => {
  const { id } = useParams();
  const { data: user } = useGetUserQuery(id, {
    refetchOnMountOrArgChange: true,
  });
  console.log(user);
  const content = (
    <div>
      <p>Hello user</p>
    </div>
  );

  return content;
};

export default EditUser;

import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetUserQuery } from './userApiSlice';

const UserAccount = () => {
  const { id } = useParams();

  const { data, error } = useGetUserQuery({ id });
  console.log(data, error);
  return <div>USER</div>;
};

export default UserAccount;

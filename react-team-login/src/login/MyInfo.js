import React, { useEffect, useState } from 'react';
import { getUserInfo } from './api/userApi';
import './MyInfo.css';

const MyInfo = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserInfo();
        setUser(data);
      } catch (err) {
        setError('사용자 정보를 불러오지 못했습니다.');
      }
    };

    fetchUser();
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!user) return <p>로딩 중...</p>;

  return (
    <div className="myinfo-container">
      <h2>내 정보</h2>
      <ul>
        <li><strong>이름:</strong> {user.name}</li>
        <li><strong>닉네임:</strong> {user.nickname}</li>
        <li><strong>이메일:</strong> {user.email}</li>
        <li><strong>성별:</strong> {user.gender}</li>
        <li><strong>비건 여부:</strong> {user.isVegan ? '예' : '아니오'}</li>
        {user.categories && user.categories.length > 0 && (
          <li>
            <strong>카테고리:</strong> {user.categories.join(', ')}
          </li>
        )}
      </ul>
    </div>
  );
};

export default MyInfo;

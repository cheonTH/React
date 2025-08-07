// src/api/userAPI.js
import axios from 'axios';

const BASE_URL = 'http://localhost:10000/api/users'; // 백엔드 서버 주소에 맞게 변경하세요

// 회원가입 요청
export const registerUser = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/signup`, formData);
    return response.data;
  } catch (error) {
    throw error.response?.data || '회원가입 요청 실패';
  }
};

// 이메일 중복 확인
export const checkEmailDuplicate = async (email) => {
  try {
    const response = await axios.get(`${BASE_URL}/check/email`, {
      params: { email },
    });
    return response.data; // true: 중복됨, false: 사용 가능
  } catch (error) {
    throw error.response?.data || '이메일 중복 확인 실패';
  }
};

// 닉네임 중복 확인
export const checkNicknameDuplicate = async (nickname) => {
  try {
    const response = await axios.get(`${BASE_URL}/check/nickname`, {
      params: { nickname },
    });
    return response.data; // true: 중복됨, false: 사용 가능
  } catch (error) {
    throw error.response?.data || '닉네임 중복 확인 실패';
  }
};

export const loginUser = async (email, password) => {
  const response = await axios.post(`${BASE_URL}/login`, null, {
    params: {
      email,
      password,
    },
  });
  return response.data; // 서버에서 토큰 문자열을 응답
};

export const getUserInfo = async () => {
  const token = localStorage.getItem('token');

  const response = await axios.get(`${BASE_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

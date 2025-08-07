import React, { useState, useEffect } from 'react';
import './Signup.css';
import { useNavigate } from 'react-router-dom';
import { checkEmailDuplicate, checkNicknameDuplicate, registerUser } from './api/userApi';

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '선택안함',
    isVegan: '',
    categories: [],
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [emailChecked, setEmailChecked] = useState(false);
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [emailMessage, setEmailMessage] = useState('');
  const [nicknameMessage, setNicknameMessage] = useState('');

  const categoriesList = ['한식', '양식', '일식', '중식', '디저트', '이유식'];

  const validate = (data) => {
    const newErrors = {};

    if (!data.name) newErrors.name = '이름은 필수입니다.';
    else if (!/^[가-힣a-zA-Z]+$/.test(data.name))
      newErrors.name = '이름은 한글 또는 영어만 입력 가능합니다.';

    if (!data.nickname) newErrors.nickname = '닉네임은 필수입니다.';
    else if (!/^[가-힣a-zA-Z0-9]+$/.test(data.nickname))
      newErrors.nickname = '한글, 영어, 숫자만 입력 가능합니다.';

    if (!data.email) newErrors.email = '이메일은 필수입니다.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      newErrors.email = '올바른 이메일 형식이 아닙니다.';

    if (!data.password) newErrors.password = '비밀번호는 필수입니다.';
    else if (
      data.password.length < 8 ||
      data.password.length > 20 ||
      [
        /[a-zA-Z]/.test(data.password),
        /[0-9]/.test(data.password),
        /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(data.password),
      ].filter(Boolean).length < 2
    ) {
      newErrors.password = '8~20자, 영문/숫자/특수문자 중 2가지 이상 포함';
    }

    if (!data.confirmPassword)
      newErrors.confirmPassword = '비밀번호 확인은 필수입니다.';
    else if (data.password !== data.confirmPassword)
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';

    if (!data.isVegan) newErrors.isVegan = '비건 여부를 선택해주세요.';

    if (data.isVegan === 'no' && data.categories.length === 0) {
      newErrors.categories = '카테고리를 최소 1개 선택해주세요.';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let updatedForm = { ...form };

    if (name === 'categories') {
      updatedForm.categories = checked
        ? [...form.categories, value]
        : form.categories.filter((cat) => cat !== value);
    } else if (name === 'isVegan') {
      updatedForm.isVegan = value;
      updatedForm.categories = [];
    } else {
      updatedForm[name] = value;
    }

    if (name === 'email') {
      setEmailChecked(false);
      setEmailMessage('');
    }

    if (name === 'nickname') {
      setNicknameChecked(false);
      setNicknameMessage('');
    }

    setForm(updatedForm);
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  useEffect(() => {
    setErrors(validate(form));
  }, [form]);

  const handleEmailCheck = async () => {
    try {
      const isDuplicate = await checkEmailDuplicate(form.email);
      if (isDuplicate) {
        setEmailMessage('이미 사용 중인 이메일입니다.');
        setEmailChecked(false);
      } else {
        setEmailMessage('사용 가능한 이메일입니다.');
        setEmailChecked(true);
      }
    } catch {
      setEmailMessage('이메일 확인 중 오류 발생');
    }
  };

  const handleNicknameCheck = async () => {
    try {
      const isDuplicate = await checkNicknameDuplicate(form.nickname);
      if (isDuplicate) {
        setNicknameMessage('이미 사용 중인 닉네임입니다.');
        setNicknameChecked(false);
      } else {
        setNicknameMessage('사용 가능한 닉네임입니다.');
        setNicknameChecked(true);
      }
    } catch {
      setNicknameMessage('닉네임 확인 중 오류 발생');
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setTouched({
    name: true,
    nickname: true,
    email: true,
    password: true,
    confirmPassword: true,
    isVegan: true,
  });

  const validationErrors = validate(form);
  setErrors(validationErrors);

  if (
    Object.keys(validationErrors).length === 0 &&
    emailChecked &&
    nicknameChecked
  ) {
    try {
      // 👇 Boolean으로 변환
      const convertedForm = {
        ...form,
        isVegan: form.isVegan === 'yes',
      };

      await registerUser(convertedForm);
      alert('회원가입 완료!');
      navigate('/');
    } catch (err) {
      console.error('회원가입 실패 응답:', err.response?.data);
      alert('회원가입 실패');
    }
  }
};

  return (
    <div className="signup-container">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="이름"
          value={form.name}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.name && <p className="error">{errors.name || ' '}</p>}

        <div className="input-group">
          <input
            type="text"
            name="nickname"
            placeholder="닉네임"
            value={form.nickname}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <button type="button" onClick={handleNicknameCheck}>
            중복 확인
          </button>
        </div>
        {(touched.nickname || nicknameMessage) && (
          <p className={nicknameChecked ? 'success' : 'error'}>
            {nicknameMessage || errors.nickname || ' '}
          </p>
        )}

        <div className="input-group">
          <input
            type="email"
            name="email"
            placeholder="이메일"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <button type="button" onClick={handleEmailCheck}>
            중복 확인
          </button>
        </div>
        {(touched.email || emailMessage) && (
          <p className={emailChecked ? 'success' : 'error'}>
            {emailMessage || errors.email || ' '}
          </p>
        )}

        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.password && <p className="error">{errors.password || ' '}</p>}

        <input
          type="password"
          name="confirmPassword"
          placeholder="비밀번호 확인"
          value={form.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.confirmPassword && (
          <p className="error">{errors.confirmPassword || ' '}</p>
        )}

        <label>성별:</label>
        <select name="gender" value={form.gender} onChange={handleChange}>
          <option value="선택안함">선택안함</option>
          <option value="남성">남성</option>
          <option value="여성">여성</option>
        </select>

        <label>비건이신가요?</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="isVegan"
              value="yes"
              checked={form.isVegan === 'yes'}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            예
          </label>
          <label>
            <input
              type="radio"
              name="isVegan"
              value="no"
              checked={form.isVegan === 'no'}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            아니오
          </label>
        </div>
        {touched.isVegan && <p className="error">{errors.isVegan || ' '}</p>}

        {form.isVegan === 'no' && (
          <div className="category-group">
            <label>관심 있는 카테고리 선택:</label>
            {categoriesList.map((cat) => (
              <label key={cat}>
                <input
                  type="checkbox"
                  name="categories"
                  value={cat}
                  checked={form.categories.includes(cat)}
                  onChange={handleChange}
                />
                {cat}
              </label>
            ))}
            {errors.categories && <p className="error">{errors.categories}</p>}
          </div>
        )}

        <button
          type="submit"
          disabled={
            !form.name ||
            !form.nickname ||
            !form.email ||
            !form.password ||
            !form.confirmPassword ||
            !form.isVegan ||
            (form.isVegan === 'no' && form.categories.length === 0) ||
            !emailChecked ||
            !nicknameChecked
          }
        >
          회원가입
        </button>
      </form>
    </div>
  );
};

export default Signup;

import axios from 'axios';

const baseUrl = 'https://todo-list.alphacamp.io/';

const axiosInstance = axios.create({
  baseUrl: baseUrl,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error(error);
  },
);

export const getTodos = async () => {
  try {
    const res = await axiosInstance.get(`${baseUrl}/todos`);

    console.log(res);
    return res.data;
  } catch (error) {
    console.log('[Get Todos failed]: ', error);
  }
};

export const createTodo = async (payload) => {
  const { title, isDone } = payload;
  try {
    const res = await axiosInstance.post(`${baseUrl}/todos`, {
      title,
      isDone,
    });
    return res.data;
  } catch (error) {
    console.log('[Creat Todo faliled]', error);
  }
};

//編輯
export const patchTodo = async (payload) => {
  const { id, title, isDone } = payload;
  try {
    const res = await axiosInstance.patch(`${baseUrl}/todos/${id}`, {
      title,
      isDone,
    });
    return res.data;
  } catch (error) {
    console.error('[Patch Todo failed]', error);
  }
};

export const deleteTodo = async (id) => {
  try {
    const res = await axiosInstance.delete(`${baseUrl}/todos/${id}`);
    return res.data;
  } catch (error) {
    console.error('[Delete Todo failed]', error);
  }
};

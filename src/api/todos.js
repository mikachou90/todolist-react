import axios from 'axios';
const baseUrl = 'http://localhost:3001';

export const getTodos = async () => {
  try {
    const res = await axios.get(`${baseUrl}/todos`);

    console.log(res);
    return res.data;
  } catch (error) {
    console.log('[Get Todos failed]: ', error);
  }
};

export const createTodo = async (payload) => {
  const { title, isDone } = payload;
  try {
    const res = await axios.post(`${baseUrl}/todos`, {
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
    const res = await axios.patch(`${baseUrl}/todos/${id}`, {
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
    const res = await axios.delete(`${baseUrl}/todos/${id}`);
    return res.data;
  } catch (error) {
    console.error('[Delete Todo failed]', error);
  }
};

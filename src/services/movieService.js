import api from "./api";

export const getMovies = async () => {
  const response = await api.get("/movies");

  return response.data;
};

export const getMovieById = async (id) => {
  const response = await api.get(
    `/movies/${id}`
  );

  return response.data;
};

export const createMovie = async (data) => {
  const response = await api.post(
    "/movies",
    data
  );

  return response.data;
};

export const updateMovie = async (id, data) => {
  const response = await api.put(
    `/movies/${id}`,
    data
  );

  return response.data;
};

export const deleteMovie = async (id) => {
  const response = await api.delete(
    `/movies/${id}`
  );

  return response.data;
};
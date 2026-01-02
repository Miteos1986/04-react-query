import axios from "axios";
import type { Movie } from "../types/movie";

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

interface SearchMovieProps {
  results: Movie[];
  total_pages: number;
  page: number;
  total_results: number;
}

const movieService = async (query: string, page: number) => {
  const response = await axios.get<SearchMovieProps>(
    "https://api.themoviedb.org/3/search/movie",
    {
      params: {
        query,
        page,
      },
      headers: {
        Authorization: `Bearer ${TMDB_TOKEN}`,
      },
    }
  );
  return response.data;
};

export default movieService;

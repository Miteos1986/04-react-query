import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
//import { Toaster } from "react-hot-toast";
import toast, { Toaster } from "react-hot-toast";
import css from "./App.module.css";
import movieService from "../../services/movieService";
import type { Movie } from "../../types/movie";
import SearchBar from "../SearchBar/SearchBar";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import ReactPaginate from "react-paginate";

function App() {
  const [query, setQuery] = useState<string>("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [page, setPage] = useState<number>(1);

  const { data, isLoading, isFetching, isSuccess, error } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => movieService(query, page),
    enabled: query !== null,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data && data.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [data]);

  const handleSearch = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      <Toaster position="top-right" />
      {(isLoading || isFetching) && (
        <strong>
          <Loader />
        </strong>
      )}

      {error && (
        <p>
          <ErrorMessage />
        </p>
      )}
      {isSuccess && data && (
        <>
          <MovieGrid movies={data.results} onSelect={openModal} />

          {data.total_pages > 1 && (
            <ReactPaginate
              pageCount={data.total_pages}
              onPageChange={handlePageChange}
              forcePage={page - 1}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
        </>
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </>
  );
}

export default App;

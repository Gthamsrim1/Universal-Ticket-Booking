import ClientMoviesList from "./components/ClientMoviesList"

const API_KEY = process.env.TMDB_API_KEY

interface Movie {
  id: number
  title: string
  release_date: string
  poster_path: string
  overview: string
}

const getMovies = async (): Promise<Movie[]> => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1&region=IN`,
    { cache: 'no-store' }
  )
  const data = await res.json()
  return data.results
}

const Page = async () => {
  const movies = await getMovies()

  return (
    <>
      <div className="flex w-full pl-64 pt-16 text-white">
        <button className="py-2 px-4">Add Shows</button>
        <button className="py-2 px-4">Manage</button>
      </div>
      <ClientMoviesList movies={movies}/>
    </>
  )
}

export default Page
  
import MoviePage from "./components/MoviePage";

interface Movie {
  backdrop_path: string;
  _id: string;
  title: string;
  release: Date;
  genres: string[];
  runtime: string;
  rating: string;
  language: string;
  cast: CastMember[];
  trailerUrl: string;
  showPeriod: {
    from: string,
    to: string,
  },
  pricingTiers: {
    regular: number;
    premium: number;
    vip: number;
  };
  showtimes: {
    theater: string;
    times: string[];
  }[];
}

interface CastMember {
  name: string;
  photo: string;
}

const getMovie = async (id: string): Promise<Movie | null> => {
  try {
    const res = await fetch("http://localhost:3000/api/movies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ movieId: id, type: "get" }),
      cache: 'no-store',
    });

    const data = await res.json();

    if (!data) return null;

    return data.movie as Movie;
  } catch (error) {
    console.error("Error fetching movie:", error);
    return null;
  }
};

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const movie = await getMovie(id);

  if (!movie) return <div>Movie not found</div>;

  return (
    <div>
      <MoviePage movie={movie} />
    </div>
  );
};

export default Page;
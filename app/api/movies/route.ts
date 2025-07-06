import { NextRequest, NextResponse } from 'next/server'
import MovieModel from '../(models)/Movies'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { movieId, title, poster_path, showtimes, dateFrom, dateTo, pricing, type } = body

    const existingMovie = movieId ? await MovieModel.findOne({ _id: movieId.toString() }) : null;

    if (type == 'add') {
      if (!movieId || !showtimes || !dateFrom || !dateTo || !pricing) {
        return NextResponse.json(
          { error: 'Missing required fields: movieId, showtimes, dateFrom, dateTo, pricing' },
          { status: 400 }
        )
      }

      const fromDate = new Date(dateFrom)
      const toDate = new Date(dateTo)

      if (fromDate > toDate) {
        return NextResponse.json(
          { error: 'dateFrom cannot be later than dateTo' },
          { status: 400 }
        )
      }

      if (existingMovie) {
        const updatedMovie = await MovieModel.findByIdAndUpdate(
          movieId.toString(),
          {
            $set: {
              isNowShowing: true,
              price: pricing.regular,
              showPeriod: {
                from: fromDate,
                to: toDate,
              },
              pricingTiers: {
                regular: pricing.regular,
                premium: pricing.premium,
                vip: pricing.vip,
              },
            },
            $push: {
              showtimes: {
                theater: 'Main Theater',
                times: showtimes,
              },
            },
          },
          { new: true, runValidators: true }
        )

        return NextResponse.json(
          {
            message: 'Movie show updated successfully',
            data: updatedMovie,
          }
        )
      } else {
        const tmdbRes = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}&append_to_response=videos,credits`);
        const tmdbData = await tmdbRes.json();
        const newMovie = new MovieModel({
          _id: movieId.toString(),
          title: title,
          poster_path: poster_path,
          release: tmdbData.release_date,
          genres: tmdbData.genres.map((g: any) => g.name),
          runtime: `${tmdbData.runtime} min`,
          rating: tmdbData.vote_average.toFixed(1),
          language: tmdbData.original_language,
          isNowShowing: true,
          price: pricing.regular,
          showPeriod: {
            from: fromDate,
            to: toDate,
          },
          pricingTiers: {
            regular: pricing.regular,
            premium: pricing.premium,
            vip: pricing.vip,
          },
          showtimes: [
            {
              theater: 'Main Theater',
              times: showtimes,
            },
          ],
        })
        const savedMovie = await newMovie.save()

        return NextResponse.json(
          {
            message: 'New movie show created successfully',
            data: savedMovie,
          }
        )
      }
    } else if (type == 'get') {
          console.log(movieId);
          const tmdbRes = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}&append_to_response=videos,credits`);
          const tmdbData = await tmdbRes.json();

          const trailer = tmdbData.videos?.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
          const cast = tmdbData.credits?.cast?.slice(0, 8)?.map((actor: any) => ({
            name: actor.name,
            photo: `https://image.tmdb.org/t/p/w300${actor.profile_path}`
          }));

          const movieData = existingMovie?.toObject() || {}

        return NextResponse.json({movie: {
          ...movieData,
          backdrop_path: `https://image.tmdb.org/t/p/original${tmdbData.backdrop_path}`,
          release: tmdbData.release_date,
          genres: tmdbData.genres.map((g: any) => g.name),
          runtime: `${tmdbData.runtime} min`,
          rating: tmdbData.vote_average.toFixed(1),
          language: tmdbData.original_language,
          trailerUrl: trailer ? `https://youtube.com/watch?v=${trailer.key}` : '',
          cast
        }});
    } else if (type == "list") {
      const movies = await MovieModel.find({});
      return NextResponse.json({ movies })
    }
  } catch (error: any) {
    console.error('Error in POST /api/movies:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
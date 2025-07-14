import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { from, to, date } = await request.json();

    if (!from || !to || !date) {
      return NextResponse.json(
        { error: 'Missing required fields: from, to' },
        { status: 400 }
      );
    }

    const response = await fetch(`https://irctc1.p.rapidapi.com/api/v1/searchTrain?fromStationCode=${from}&toStationCode=${to}&dateOfJourney=${date}`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY!,
          'X-RapidAPI-Host': 'irctc1.p.rapidapi.com'
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: 'Failed to fetch train data', details: errorText },
        { status: 501  }
      );
    }

    const res = await response.json();
    console.log(res);
    return NextResponse.json({ trains: res.data });
  } catch (error: any) {
    console.error('Error fetching train data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

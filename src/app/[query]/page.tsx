import OpenAI from 'openai';
import { DestinationItem, SearchKeys } from '@/types';
import Image from 'next/image';
import { getDestinationImage } from '@/imageGetter';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function RequestPage(props: {
  params: { query: string };
}) {
  const pathNameParams = new URLSearchParams(
    decodeURIComponent(props.params.query)
  );
  console.log(pathNameParams);
  const { location, month, budget, activity } = Object.fromEntries(
    pathNameParams
  ) as Record<SearchKeys, string>;

  if (!location || !month) return <p>No data</p>;

  let textPrompt = `Make a list of the top place to travel as a digital nomad from ${location} in ${month}`;
  if (activity) textPrompt += ` to do ${activity}`;
  if (budget) textPrompt += ` with budget of ${budget}$ per month`;
  textPrompt +=
    ' and explain why. In format Location - Description. Make description around 60 words.';

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: textPrompt }],
    temperature: 0,
    max_tokens: 2000
  });

  //console.log(response.choices[0].message.content)

  const [, ...entries] = JSON.stringify(
    response.choices[0].message.content
  ).split('\\n\\n');

  const destinations: DestinationItem[] = [];

  for (const entry of entries) {
    const [locationWithNumber, description] = entry.split(' - ');
    const [, location] = locationWithNumber.split('.');

    const apiKey = 'AIzaSyC0CuwQE_EPaAFRbCKOHmMzGbosguOEr74';
    const cx = '123dc09aea7fb4e5c';

    const imageUrl: string | null = await getDestinationImage(
      location,
      apiKey,
      cx
    );
    //const imageUrl = 'https://fastly.picsum.photos/id/10/2500/1667.jpg?hmac=J04WWC_ebchx3WwzbM-Z4_KC_LeLBWr5LZMaAkWkF68'
    destinations.push({ location, description, img: imageUrl });
  }

  return (
    <div className="flex flex-col gap-4">
      {destinations.map(({ location, description, img }) => (
        <div key={location} className="card lg:card-side bg-base-100 shadow-xl">
          <figure className="relative w-full min-w-[230px] max-w-[230px]">
            <Image src={img} alt={location} fill />
          </figure>

          <div className="card-body">
            <h2 className="card-title">{location}</h2>
            <p>{description} </p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary top-2">Learn More</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

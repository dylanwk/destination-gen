
import OpenAI from "openai";
import { DestinationItem, SearchKeys } from "@/types";
import Image from "next/image";
import { getDestinationImage } from "@/imageGetter";



const openai = new OpenAI({
    apiKey: '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',
});

export default async function RequestPage(props: {
  params: { query: string };
}) {
  const pathNameParams = new URLSearchParams(
    decodeURIComponent(props.params.query)
  );
  const { location, month, budget, activity } = Object.fromEntries(
    pathNameParams
  ) as Record<SearchKeys, string>;

  if (!location || !month) return <p>No data</p>;

  let textPrompt = `Make a list of top 5 places to travel as digital nomad from ${location} in ${month}`;
  if (activity) textPrompt += ` to do ${activity}`;
  if (budget) textPrompt += ` with budget of ${budget}$ per month`;
  textPrompt += " and explain why. In format Location - Description";

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: textPrompt }],
    temperature: 0,
    max_tokens: 2000,
  });

  //console.log(response.choices[0].message.content)

  const [, ...entries] = JSON.stringify(
    response.choices[0].message.content
  ).split("\\n\\n");

  const destinations: DestinationItem[] = [];

  for (const entry of entries) {
    const [locationWithNumber, description] = entry.split(" - ");
    const [, location] = locationWithNumber.split(".");

    /*
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: "Best place in" + location,
      n: 1,
      size: "1024x1024",
    });
    
    
    
    if (response && response.data && response.data.length > 0) {
      const imageData = response.data[0];
      
      if (imageData && typeof imageData.url === 'string') {
        const imageURL = imageData.url;
        //console.log("Image URL:", imageURL);
    
        destinations.push({ location, description, img: imageURL });
      } else {
        console.error("Invalid or missing 'url' property in the response data.");
      }
    } else {
      console.error("Invalid or empty response:", response);
    }
  } -> Dalle image generator code
  */  

  const apiKey = 'AIzaSyC0CuwQE_EPaAFRbCKOHmMzGbosguOEr74';
  const cx = '123dc09aea7fb4e5c';
  
  const imageUrl: string | null = await getDestinationImage(location, apiKey, cx);
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
            <p>{description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

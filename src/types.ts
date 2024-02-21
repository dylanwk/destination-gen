
export type DestinationItem = { location: string, description: string, img: string }

export enum SearchKeys {
    Location = 'location',
    Month = 'month',
    Budget = 'budget',
    Activity = 'activity'
}

type Question = {
    id: string;
    label: string;
    type: "open-ended" | "multiple-choice";
    options?: string[];
    description?: string;
  };

type UserResponses = Record<string, string | number>;


const questions: Question[] = [
    {
      id: "Wifi Speed preference",
      label: "What is your Wifi preference?",
      type: "multiple-choice",
      options: [
        "No Need for Wifi",
        "Moderate (~30mbs)",
        "High Speeds (~60mbs)",
      ],
    }
  ];

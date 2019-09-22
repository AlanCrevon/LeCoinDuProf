export interface GoogleResult {
  description: string;
  id: string;
  matched_substrings: Matchedsubstring[];
  place_id: string;
  reference: string;
  structured_formatting: Structuredformatting;
  terms: Term[];
  types: string[];
}

interface Term {
  offset: number;
  value: string;
}

interface Structuredformatting {
  main_text: string;
  main_text_matched_substrings: Matchedsubstring[];
  secondary_text: string;
}

interface Matchedsubstring {
  length: number;
  offset: number;
}

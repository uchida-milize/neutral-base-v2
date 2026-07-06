export type Plan = {
  id: string;
  name: string;
  price: string;
  lead: string;
  feat: string[];
  tag?: string;
  death?: boolean;
  tooltip?: { sections: { head: string; body: string }[] };
  disclosure?: AgreeBlock[];
};

export type AgreeBlock = {
  p?: string;
  ul?: string[];
  link?: string;
  download?: string;
  note?: string;
  table?: string[][];
  head?: string;
  strong?: string;
  cat?: string;
  checks?: string[];
  linkBtn?: { label: string; href: string };
  bulletLinks?: { text: string; url: string }[];
};

export type AgreeItemData = {
  t: string;
  blocks: AgreeBlock[];
  kind?: string;
  id?: string;
};

import GroupPageClient from "./GroupPageClient";

export function generateStaticParams() {
  return [
    { group: "overview" },
    { group: "step2" },
    { group: "pin" },
    { group: "form" },
    { group: "form-kokuchi" },
    { group: "step4" },
    { group: "card" },
    { group: "done" },
    { group: "ended" },
  ];
}

export default function TheoTdfWindowsGroupPage() {
  return <GroupPageClient />;
}

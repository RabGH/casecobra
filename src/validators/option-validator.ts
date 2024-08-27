// bg-blue-950 border-blue-950
// bg-zinc-900 border-zinc-900
// bg-rose-950 border-rose-950
// bg-white border-white
// bg-emerald-600 border-emerald-600

export const COLORS = [
  { label: "Black", value: "black", tw: "zinc-900" },
  { label: "Blue", value: "blue", tw: "blue-950" },
  { label: "Rose", value: "rose", tw: "rose-950" },
  { label: "Emerald", value: "emerald", tw: "emerald-600" },
  { label: "White", value: "white", tw: "white" },
] as const; // very important, sets it as readonly. Without, it becomes a generic.

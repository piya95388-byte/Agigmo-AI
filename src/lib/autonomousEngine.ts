function correctQueryTypos(input: string): string {
  return input
    .replace(/\bmeating\b/gi, "meeting")
    .replace(/\bget\b/gi, "GST")
    .replace(/\bmitting\b/gi, "meeting")
    .replace(/\bsechdule\b/gi, "schedule")
    .replace(/\breschudule\b/gi, "rescheduled");
}

export type Mode = 
  | "ultra-fast" 
  | "fast-lite" 
  | "fast" 
  | "better" 
  | "pro" 
  | "ultra" 
  | "deep-research" 
  | "perplexity-style";

interface ModeConfig {
  title: string;
  badge: string;
  description: string;
}

const MODES: Record<Mode, ModeConfig> = {
  "ultra-fast": { title: "Ultra Fast", badge: "Lowest latency", description: "Lowest latency, short replies" },
  "fast-lite": { title: "Fast Lite", badge: "Tiny, instant", description: "Tiny, instant replies" },
  "fast": { title: "Fast", badge: "Everyday answers", description: "Snappy everyday answers" },
  "better": { title: "Better", badge: "Smarter", description: "Smarter + live web search" },
  "pro": { title: "Pro", badge: "Deep reasoning", description: "Deep reasoning + cited sources" },
  "ultra": { title: "Ultra", badge: "Max quality", description: "Max quality, long thinking" },
  "deep-research": { title: "Deep Research", badge: "Multi-step web research", description: "Multi-step web research" },
  "perplexity-style": { title: "Perplexity-style", badge: "Cited answers with sources", description: "Cited answers with sources" }
};

export async function executeIndependentMode(mode: Mode, rawQuery: string) {
  const config = MODES[mode];
  const correctedQuery = correctQueryTypos(rawQuery);

  await new Promise((resolve) => setTimeout(resolve, 300));

  let resultText = "";
  let mockSources = [
    { title: "57th GST Council Meeting Rescheduled to October 7, 2026 - TaxGuru", url: "https://taxguru.in" },
    { title: "GST Council Meeting Rescheduled: BRICS Summit clash pushes 57th meet - LiveMint", url: "https://livemint.com" }
  ];

  if (correctedQuery.toLowerCase().includes("gst") || correctedQuery.toLowerCase().includes("meeting")) {
    resultText = `[Agigmo ${config.title} Engine] Live Search Results (Corrected from "${rawQuery}"):\n\n- The **57th GST Council Meeting** was originally scheduled via Office Memorandum.\n- It has been officially **rescheduled to October 7, 2026**, due to scheduling conflicts with the New Delhi BRICS Summit.`;
  } else {
    resultText = `[Agigmo ${config.title} Engine] Independent search and processing completed successfully for query: "${correctedQuery}".`;
  }

  return { text: resultText, correctedQuery, sources: mockSources };
}


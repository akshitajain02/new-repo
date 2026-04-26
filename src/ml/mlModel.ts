import { mlDataset } from "./mlDataset";

type Label = 0 | 1;

type PredictionResult = {
  label: Label;
  result: "safe" | "phishing";
  confidence: number;
  phishingScore: number;
  safeScore: number;
};

const tokenize = (text: string): string[] => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2);
};

const trainModel = () => {
  const wordCounts = {
    safe: new Map<string, number>(),
    phishing: new Map<string, number>(),
  };

  let safeDocs = 0;
  let phishingDocs = 0;
  let safeWords = 0;
  let phishingWords = 0;

  const vocabulary = new Set<string>();

  mlDataset.forEach((email) => {
    const words = tokenize(email.text);

    if (email.label === 0) safeDocs++;
    else phishingDocs++;

    words.forEach((word) => {
      vocabulary.add(word);

      if (email.label === 0) {
        wordCounts.safe.set(word, (wordCounts.safe.get(word) || 0) + 1);
        safeWords++;
      } else {
        wordCounts.phishing.set(word, (wordCounts.phishing.get(word) || 0) + 1);
        phishingWords++;
      }
    });
  });

  return {
    wordCounts,
    safeDocs,
    phishingDocs,
    safeWords,
    phishingWords,
    vocabularySize: vocabulary.size,
    totalDocs: mlDataset.length,
  };
};

const model = trainModel();

export const predictEmail = (inputText: string): PredictionResult => {
  const words = tokenize(inputText);

  let safeLogProb = Math.log(model.safeDocs / model.totalDocs);
  let phishingLogProb = Math.log(model.phishingDocs / model.totalDocs);

  words.forEach((word) => {
    const safeWordCount = model.wordCounts.safe.get(word) || 0;
    const phishingWordCount = model.wordCounts.phishing.get(word) || 0;

    const safeWordProb =
      (safeWordCount + 1) / (model.safeWords + model.vocabularySize);

    const phishingWordProb =
      (phishingWordCount + 1) /
      (model.phishingWords + model.vocabularySize);

    safeLogProb += Math.log(safeWordProb);
    phishingLogProb += Math.log(phishingWordProb);
  });

  const maxLog = Math.max(safeLogProb, phishingLogProb);

  const safeScore = Math.exp(safeLogProb - maxLog);
  const phishingScore = Math.exp(phishingLogProb - maxLog);

  const total = safeScore + phishingScore;

  const safeProbability = safeScore / total;
  const phishingProbability = phishingScore / total;

  const label: Label = phishingProbability > safeProbability ? 1 : 0;

  return {
    label,
    result: label === 1 ? "phishing" : "safe",
    confidence:
      label === 1
         ? Math.min(92, Math.max(60, Math.round(phishingProbability * 100)))
    : Math.min(90, Math.max(55, Math.round(safeProbability * 100))),
    phishingScore: Math.round(phishingProbability * 100),
    safeScore: Math.round(safeProbability * 100),
  };
};
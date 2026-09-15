import type { Question, QuestionOption, Survey } from "./data";

export type SurveyPresentation = {
  questionOrder: string[];
  optionOrderByQuestion: Record<string, string[]>;
};

const SPECIAL_OPTION_PATTERN =
  /^(other|none of the above|prefer not to say|don't know|not applicable)$/i;

function hashSeed(value: string) {
  return [...value].reduce(
    (hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0,
    2166136261,
  );
}

function nextRandom(seed: number) {
  let next = seed + 0x6d2b79f5;
  next = Math.imul(next ^ (next >>> 15), next | 1);
  next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
  return { seed: next >>> 0, value: ((next ^ (next >>> 14)) >>> 0) / 4294967296 };
}

function shuffle<T>(items: T[], seed: number) {
  const result = [...items];
  let currentSeed = seed;
  for (let index = result.length - 1; index > 0; index -= 1) {
    const random = nextRandom(currentSeed);
    currentSeed = random.seed;
    const swapIndex = Math.floor(random.value * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex]!, result[index]!];
  }
  return result;
}

function uniqueQuestions(questions: Question[]) {
  const seenIds = new Set<string>();
  const seenPrompts = new Set<string>();
  return questions.filter((question) => {
    const prompt = question.prompt.trim().toLowerCase();
    if (seenIds.has(question.id) || seenPrompts.has(prompt)) return false;
    seenIds.add(question.id);
    seenPrompts.add(prompt);
    return true;
  });
}

function randomizeQuestionOrder(questions: Question[], seed: number) {
  const result: Question[] = [];
  let currentSection: string | undefined;
  let sectionQuestions: Question[] = [];

  const flushSection = () => {
    const movable = sectionQuestions.filter(
      (question) => question.randomizable && !question.dependsOn,
    );
    const randomized = shuffle(movable, seed + result.length);
    let movableIndex = 0;
    result.push(
      ...sectionQuestions.map((question) => {
        if (question.randomizable && !question.dependsOn) return randomized[movableIndex++]!;
        return question;
      }),
    );
    sectionQuestions = [];
  };

  questions.forEach((question) => {
    const section = question.section ?? "__default";
    if (currentSection !== undefined && section !== currentSection) flushSection();
    currentSection = section;
    sectionQuestions.push(question);
  });
  flushSection();
  return result.map((question) => question.id);
}

function canRandomizeOption(option: QuestionOption) {
  return option.randomizable !== false && !SPECIAL_OPTION_PATTERN.test(option.label.trim());
}

function randomizeOptions(question: Question, seed: number) {
  if (question.optionOrder === "fixed") return question.options.map((option) => option.id);

  const fixed = question.options.filter((option) => !canRandomizeOption(option));
  const movable = question.options.filter(canRandomizeOption);
  const randomized = shuffle(movable, seed);
  return [...randomized, ...fixed].map((option) => option.id);
}

export function createSurveyPresentation(survey: Survey, attemptId: string): SurveyPresentation {
  const questions = uniqueQuestions(survey.questionSet);
  const seed = hashSeed(`${attemptId}:${survey.id}`);
  const questionOrder = randomizeQuestionOrder(questions, seed);
  const optionOrderByQuestion = Object.fromEntries(
    questions.map((question, index) => [question.id, randomizeOptions(question, seed + index + 1)]),
  );

  return { questionOrder, optionOrderByQuestion };
}

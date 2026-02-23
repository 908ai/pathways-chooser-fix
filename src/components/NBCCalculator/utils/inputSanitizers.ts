// src/components/NBCCalculator/utils/inputSanitizers.ts

export type InputMode =
  | "DECIMAL"
  | "DECIMAL_OR_NA"
  | "DECIMAL_OR_KEYWORD";

export type BlurAction = "NONE" | "TRIM_TRAILING_DOT";

export type KeywordConfig = {
  /** Ex: "uninsulated" (sempre armazenaremos exatamente como esse string) */
  keyword: string;
  /** Se true, o usuário pode digitar a keyword gradualmente (prefix match) */
  allowPrefixTyping?: boolean;
};

export type SanitizerConfig = {
  mode: InputMode;

  /** Se DECIMAL, quantas casas decimais permitir (não arredonda; só bloqueia padrões muito esquisitos). Opcional. */
  maxDecimals?: number;

  /** Se true, permite string vazia */
  allowEmpty?: boolean;

  /** Para DECIMAL_OR_NA: normaliza para "N/A" no blur */
  normalizeNAOnBlur?: boolean;

  /** Para DECIMAL_OR_KEYWORD */
  keywordConfig?: KeywordConfig;

  /** No blur, remove trailing "." (ex: "5." -> "5") */
  blurAction?: BlurAction;

  /** Se true, remove espaços no onChange (útil p/ NA typing) */
  stripSpacesOnChange?: boolean;
};

export type SanitizerResult = {
  value: string;
  /** True se o valor parece "em progresso" (ex: "N", "N/", "u", "unin...") */
  isPartialToken?: boolean;
  /** True se o valor está em formato final (ex: "N/A", "uninsulated", "5.02") */
  isFinalToken?: boolean;
};

const DEFAULT_CONFIG: SanitizerConfig = {
  mode: "DECIMAL",
  maxDecimals: undefined,
  allowEmpty: true,
  normalizeNAOnBlur: true,
  keywordConfig: undefined,
  blurAction: "TRIM_TRAILING_DOT",
  stripSpacesOnChange: false,
};

const isControlKey = (key: string) =>
  [
    "Backspace",
    "Delete",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "Tab",
    "Home",
    "End",
    "Enter",
  ].includes(key);

const hasModifier = (e: KeyboardEvent | React.KeyboardEvent) =>
  // @ts-ignore
  !!(e.ctrlKey || e.metaKey || e.altKey);

/**
 * ✅ PROTEÇÃO PRINCIPAL
 * - aceita string/number
 * - aceita event (React ou nativo) e extrai target.value
 * - qualquer outro objeto => "" (evita "[object Object]" no input)
 */
type MaybeEventLike = { target?: { value?: unknown } };

export function extractRawValue(raw: unknown): string {
  // If someone passed the event by mistake
  const maybeEvent = raw as MaybeEventLike;
  if (maybeEvent?.target && "value" in (maybeEvent.target as any)) {
    const v = (maybeEvent.target as any).value;
    if (v === null || v === undefined) return "";
    if (typeof v === "string") return v;
    if (typeof v === "number") return String(v);
    // avoid coercing objects to "[object Object]"
    return "";
  }

  if (raw === null || raw === undefined) return "";
  if (typeof raw === "string") return raw;
  if (typeof raw === "number") return String(raw);

  // avoid coercing objects/arrays to "[object Object]"
  return "";
}

function keepOnlyDigitsAndDot(raw: string) {
  let v = raw.replace(/[^\d.]/g, "");
  const firstDot = v.indexOf(".");
  if (firstDot !== -1) {
    v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, "");
  }
  return v;
}

function enforceMaxDecimals(v: string, maxDecimals?: number) {
  if (!maxDecimals && maxDecimals !== 0) return v;
  const dot = v.indexOf(".");
  if (dot === -1) return v;
  const intPart = v.slice(0, dot);
  const decPart = v.slice(dot + 1);
  return `${intPart}.${decPart.slice(0, maxDecimals)}`;
}

/**
 * Para N/A: permite o usuário digitar N, N/, NA, N/A (qualquer case).
 * Retorna o texto "como digitado" (sem forçar uppercase) no onChange.
 */
function sanitizeNAProgress(raw: string): SanitizerResult {
  // remove espaços e mantém somente N, A e /
  const kept = raw.replace(/\s+/g, "").replace(/[^nNaA/]/g, "");

  // impede múltiplas barras
  const firstSlash = kept.indexOf("/");
  const normalized =
    firstSlash === -1
      ? kept
      : kept.slice(0, firstSlash + 1) + kept.slice(firstSlash + 1).replace(/\//g, "");

  const upper = normalized.toUpperCase();

  const isPartial =
    upper === "N" || upper === "N/" || upper === "NA" || upper === "N/A" || upper === "N/A/";
  // Nota: "N/A/" vira "N/A" no blur por normalizeNAOnBlur, mas aqui deixamos digitar

  const isFinal = upper === "N/A";

  return { value: normalized, isPartialToken: isPartial, isFinalToken: isFinal };
}

function isNAFinal(v: string) {
  return v.replace(/\s+/g, "").toUpperCase() === "N/A";
}

function matchesKeywordPrefix(raw: string, keyword: string) {
  const lower = raw.toLowerCase();
  return keyword.toLowerCase().startsWith(lower);
}

function sanitizeKeywordProgress(
  raw: string,
  keywordCfg: KeywordConfig
): SanitizerResult {
  const keyword = keywordCfg.keyword;
  const allowPrefixTyping = keywordCfg.allowPrefixTyping ?? true;

  // Mantém somente letras (e remove espaços)
  const lettersOnly = raw.replace(/\s+/g, "").replace(/[^a-z]/gi, "");
  if (!lettersOnly) return { value: "" };

  const lower = lettersOnly.toLowerCase();

  if (!allowPrefixTyping) {
    // só aceita o keyword completo
    if (lower === keyword.toLowerCase()) {
      return { value: keyword, isFinalToken: true };
    }
    // se não bate, não muda (caller decide manter o anterior)
    return { value: "" };
  }

  if (matchesKeywordPrefix(lower, keyword)) {
    const isFinal = lower === keyword.toLowerCase();
    // guardamos sempre o valor em lower enquanto digita, e no final normaliza pro keyword original
    return { value: isFinal ? keyword : lower, isPartialToken: !isFinal, isFinalToken: isFinal };
  }

  // não permite caracteres fora do prefixo -> retorna vazio para o caller ignorar update
  return { value: "" };
}

/**
 * Sanitiza durante o onChange (sem "corrigir" agressivamente para evitar cursor jump).
 *
 * ✅ Agora aceita unknown (string OU event). Isso impede o bug do trim e o "[object Object]".
 */
export function sanitizeOnChange(rawInput: unknown, cfg?: Partial<SanitizerConfig>): SanitizerResult {
  const c: SanitizerConfig = { ...DEFAULT_CONFIG, ...(cfg || {}) };

  let raw = extractRawValue(rawInput);

  if (c.stripSpacesOnChange) raw = raw.replace(/\s+/g, "");

  if (!raw) return { value: c.allowEmpty ? "" : "" };

  // DECIMAL_OR_NA: se começa com N/n -> trata como NA typing
  if (c.mode === "DECIMAL_OR_NA") {
    if (/^n/i.test(raw.trim())) return sanitizeNAProgress(raw);
    const v = enforceMaxDecimals(keepOnlyDigitsAndDot(raw), c.maxDecimals);
    return { value: v };
  }

  // DECIMAL_OR_KEYWORD: se começa com letra -> tenta keyword; senão decimal
  if (c.mode === "DECIMAL_OR_KEYWORD") {
    const keywordCfg = c.keywordConfig;
    if (!keywordCfg) {
      // fallback para DECIMAL
      const v = enforceMaxDecimals(keepOnlyDigitsAndDot(raw), c.maxDecimals);
      return { value: v };
    }

    // se começa com letra, tenta keyword progress
    if (/^[a-z]/i.test(raw.trim())) {
      const kw = sanitizeKeywordProgress(raw, keywordCfg);
      return kw;
    }

    // senão decimal
    const v = enforceMaxDecimals(keepOnlyDigitsAndDot(raw), c.maxDecimals);
    return { value: v };
  }

  // DECIMAL
  const v = enforceMaxDecimals(keepOnlyDigitsAndDot(raw), c.maxDecimals);
  return { value: v };
}

/**
 * Normaliza no blur (ex: "n/a" -> "N/A", "5." -> "5", keyword incompleta -> "")
 *
 * ✅ Agora aceita unknown (string OU event).
 */
export function sanitizeOnBlur(rawInput: unknown, cfg?: Partial<SanitizerConfig>): SanitizerResult {
  const c: SanitizerConfig = { ...DEFAULT_CONFIG, ...(cfg || {}) };

  let v = extractRawValue(rawInput).trim();
  if (!v) return { value: "" };

  // N/A normalization
  if (c.mode === "DECIMAL_OR_NA") {
    const compact = v.replace(/\s+/g, "");
    if (/^n\/?a$/i.test(compact) && c.normalizeNAOnBlur) {
      return { value: "N/A", isFinalToken: true };
    }
    // numeric cleanup
    v = keepOnlyDigitsAndDot(v);
    if (c.blurAction === "TRIM_TRAILING_DOT" && /^\d+\.$/.test(v)) v = v.slice(0, -1);
    v = enforceMaxDecimals(v, c.maxDecimals);
    return { value: v };
  }

  // Keyword normalization
  if (c.mode === "DECIMAL_OR_KEYWORD") {
    const keywordCfg = c.keywordConfig;
    if (keywordCfg && /^[a-z]/i.test(v)) {
      const target = keywordCfg.keyword.toLowerCase();
      const lower = v.replace(/\s+/g, "").toLowerCase();

      // se ficou exatamente keyword -> normaliza pro keyword original
      if (lower === target) return { value: keywordCfg.keyword, isFinalToken: true };

      // se ficou incompleto (prefix) -> zera no blur (opinião: melhor do que salvar lixo)
      if (matchesKeywordPrefix(lower, target)) return { value: "" };

      // qualquer outra palavra -> zera
      return { value: "" };
    }

    // senão numeric cleanup
    v = keepOnlyDigitsAndDot(v);
    if (c.blurAction === "TRIM_TRAILING_DOT" && /^\d+\.$/.test(v)) v = v.slice(0, -1);
    v = enforceMaxDecimals(v, c.maxDecimals);
    return { value: v };
  }

  // DECIMAL
  v = keepOnlyDigitsAndDot(v);
  if (c.blurAction === "TRIM_TRAILING_DOT" && /^\d+\.$/.test(v)) v = v.slice(0, -1);
  v = enforceMaxDecimals(v, c.maxDecimals);
  return { value: v };
}

/**
 * Helper para onKeyDown: bloqueia teclas inválidas conforme o modo.
 * Use isso para reduzir 30 linhas repetidas em cada input.
 */
export function shouldBlockKeyDown(
  e: React.KeyboardEvent<HTMLInputElement>,
  currentValue: string,
  cfg?: Partial<SanitizerConfig>
): boolean {
  const c: SanitizerConfig = { ...DEFAULT_CONFIG, ...(cfg || {}) };

  if (hasModifier(e)) return false; // Ctrl/Cmd shortcuts
  if (isControlKey(e.key)) return false;

  const key = e.key;

  // Sempre permite dígitos e ponto para todos os modos (decimais)
  if (/[0-9]/.test(key)) return false;
  if (key === ".") return false;

  // DECIMAL: bloqueia todo resto
  if (c.mode === "DECIMAL") return true;

  // DECIMAL_OR_NA: permite N, A e /
  if (c.mode === "DECIMAL_OR_NA") {
    if (["n", "N", "a", "A", "/"].includes(key)) return false;
    return true;
  }

  // DECIMAL_OR_KEYWORD: permite letras (mas valida no onChange como prefix) — e bloqueia símbolos
  if (c.mode === "DECIMAL_OR_KEYWORD") {
    if (/^[a-z]$/i.test(key)) return false;
    return true;
  }

  return true;
}

/**
 * Pequeno util: detecta se o valor atual é N/A (final).
 */
export function isNA(value: string): boolean {
  return isNAFinal(value || "");
}

/**
 * Detecta se o valor atual é exatamente a keyword final.
 */
export function isKeywordFinal(value: string, keyword: string): boolean {
  return (value || "").trim().toLowerCase() === (keyword || "").trim().toLowerCase();
}

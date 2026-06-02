import type { ReactNode } from "react";
import { TOKEN_CLASS } from "..";

const JSON_TOKENIZER =
  /("(?:[^"\\]|\\.)*")(\s*:)|("(?:[^"\\]|\\.)*")|(-?\d+(?:\.\d+)?)|\b(true|false|null)\b|([{}[\],:])/g;

const highlightJson = (text: string): ReactNode[] => {
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  const re = new RegExp(JSON_TOKENIZER);
  while ((m = re.exec(text)) !== null) {
    if (m.index > last)
      out.push(<span key={i++}>{text.slice(last, m.index)}</span>);
    if (m[1] !== undefined) {
      out.push(
        <span
          key={i++}
          className={m[1].startsWith('"$') ? TOKEN_CLASS.kw : "text-and"}
        >
          {m[1]}
        </span>,
      );
      out.push(
        <span key={i++} className={TOKEN_CLASS.op}>
          {m[2]}
        </span>,
      );
    } else if (m[3] !== undefined) {
      out.push(
        <span key={i++} className={TOKEN_CLASS.str}>
          {m[3]}
        </span>,
      );
    } else if (m[4] !== undefined) {
      out.push(
        <span key={i++} className={TOKEN_CLASS.num}>
          {m[4]}
        </span>,
      );
    } else if (m[5] !== undefined) {
      out.push(
        <span key={i++} className={TOKEN_CLASS.kw}>
          {m[5]}
        </span>,
      );
    } else {
      out.push(
        <span key={i++} className={TOKEN_CLASS.op}>
          {m[0]}
        </span>,
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length)
    out.push(<span key={i++}>{text.slice(last)}</span>);
  return out;
};

export default highlightJson;

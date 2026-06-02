import type { ReactNode } from "react";
import { SQL_TOKENIZER, TOKEN_CLASS } from "..";

const highlightSql = (text: string): ReactNode[] => {
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  const re = new RegExp(SQL_TOKENIZER);
  while ((m = re.exec(text)) !== null) {
    if (m.index > last)
      out.push(
        <span key={i++} className={TOKEN_CLASS.id}>
          {text.slice(last, m.index)}
        </span>,
      );
    let cls: string = TOKEN_CLASS.id;
    if (m[1]) cls = TOKEN_CLASS.str;
    else if (m[2]) cls = TOKEN_CLASS.num;
    else if (m[3]) cls = TOKEN_CLASS.kw;
    else if (m[4]) cls = TOKEN_CLASS.op;
    out.push(
      <span key={i++} className={cls}>
        {m[0]}
      </span>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length)
    out.push(
      <span key={i++} className={TOKEN_CLASS.id}>
        {text.slice(last)}
      </span>,
    );
  return out;
};

export default highlightSql;

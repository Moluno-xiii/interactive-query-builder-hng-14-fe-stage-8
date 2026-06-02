import type { IconBaseProps, IconType } from "react-icons";
import {
  PiCalendarBlank,
  PiCircle,
  PiHash,
  PiTag,
  PiTextAa,
  PiToggleLeft,
} from "react-icons/pi";

const FIELD_ICONS: Record<string, IconType> = {
  hash: PiHash,
  num: PiHash,
  text: PiTextAa,
  tag: PiTag,
  bool: PiToggleLeft,
  date: PiCalendarBlank,
};

interface FieldIconProps extends IconBaseProps {
  name: string;
}

const FieldIcon = ({ name, ...props }: FieldIconProps) => {
  const Glyph = FIELD_ICONS[name] ?? PiCircle;
  return <Glyph {...props} />;
};

export default FieldIcon;

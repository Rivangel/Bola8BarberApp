import React from 'react';
import Svg, {
  Circle,
  Line,
  Path,
  Polyline,
  Rect,
} from 'react-native-svg';
import { colors } from '@/constants/colors';

export type IconName =
  | 'bell'
  | 'home'
  | 'calendar'
  | 'calendar-line'
  | 'plus'
  | 'clients'
  | 'user'
  | 'phone'
  | 'search'
  | 'chevron-left'
  | 'chevron-right'
  | 'clock'
  | 'scissors'
  | 'euro'
  | 'dollar'
  | 'check'
  | 'close'
  | 'edit'
  | 'camera'
  | 'mail'
  | 'map-pin'
  | 'settings'
  | 'logout'
  | 'lock'
  | 'eye'
  | 'eye-off';

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

// Line icons traced from the imported design (lucide/feather geometry, 24×24).
export function Icon({ name, size = 22, color = colors.textPrimary, strokeWidth = 2 }: Props) {
  const common = {
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };

  const body = () => {
    switch (name) {
      case 'bell':
        return (
          <>
            <Path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" {...common} />
            <Path d="M13.7 21a2 2 0 0 1-3.4 0" {...common} />
          </>
        );
      case 'home':
        return (
          <>
            <Path d="M3 11l9-8 9 8" {...common} />
            <Path d="M5 10v9h14v-9" {...common} />
          </>
        );
      case 'calendar':
        return (
          <>
            <Rect x={3} y={4} width={18} height={17} rx={2} {...common} />
            <Line x1={3} y1={9} x2={21} y2={9} {...common} />
            <Line x1={8} y1={2} x2={8} y2={6} {...common} />
            <Line x1={16} y1={2} x2={16} y2={6} {...common} />
          </>
        );
      case 'calendar-line':
        return (
          <>
            <Rect x={3} y={4} width={18} height={17} rx={2} {...common} />
            <Line x1={3} y1={9} x2={21} y2={9} {...common} />
          </>
        );
      case 'plus':
        return (
          <>
            <Line x1={12} y1={5} x2={12} y2={19} {...common} />
            <Line x1={5} y1={12} x2={19} y2={12} {...common} />
          </>
        );
      case 'clients':
        return (
          <>
            <Circle cx={9} cy={8} r={3} {...common} />
            <Path d="M3 20c0-3.3 2.7-5 6-5s6 1.7 6 5" {...common} />
            <Path d="M16 5.5a3 3 0 0 1 0 5.5" {...common} />
            <Path d="M21 20c0-3-1.5-4.5-3.5-5" {...common} />
          </>
        );
      case 'user':
        return (
          <>
            <Circle cx={12} cy={8} r={4} {...common} />
            <Path d="M4 21c0-4 4-6 8-6s8 2 8 6" {...common} />
          </>
        );
      case 'phone':
        return (
          <Path
            d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z"
            {...common}
          />
        );
      case 'search':
        return (
          <>
            <Circle cx={11} cy={11} r={7} {...common} />
            <Line x1={21} y1={21} x2={16.5} y2={16.5} {...common} />
          </>
        );
      case 'chevron-left':
        return <Polyline points="15 18 9 12 15 6" {...common} />;
      case 'chevron-right':
        return <Polyline points="9 18 15 12 9 6" {...common} />;
      case 'clock':
        return (
          <>
            <Circle cx={12} cy={12} r={9} {...common} />
            <Polyline points="12 7 12 12 15 14" {...common} />
          </>
        );
      case 'scissors':
        return (
          <>
            <Path d="M6 3v6a3 3 0 0 0 3 3h0a3 3 0 0 0 3-3V3" {...common} />
            <Path d="M9 12v9" {...common} />
            <Path d="M18 3l-3 6v12" {...common} />
          </>
        );
      case 'euro':
        return (
          <>
            <Line x1={12} y1={1} x2={12} y2={23} {...common} />
            <Path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" {...common} />
          </>
        );
      case 'dollar':
        return (
          <>
            <Line x1={12} y1={1} x2={12} y2={23} {...common} />
            <Path d="M17 6.5C17 4.6 14.5 3.5 12 3.5S7 4.7 7 7s2.5 3.2 5 3.7 5 1.4 5 3.8-2.5 3.5-5 3.5-5-1-5-3" {...common} />
          </>
        );
      case 'check':
        return <Polyline points="20 6 9 17 4 12" {...common} />;
      case 'close':
        return (
          <>
            <Line x1={18} y1={6} x2={6} y2={18} {...common} />
            <Line x1={6} y1={6} x2={18} y2={18} {...common} />
          </>
        );
      case 'edit':
        return <Path d="M17 3a2.8 2.8 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z" {...common} />;
      case 'camera':
        return (
          <>
            <Path
              d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z"
              {...common}
            />
            <Circle cx={12} cy={13} r={3.2} {...common} />
          </>
        );
      case 'mail':
        return (
          <>
            <Rect x={2} y={4} width={20} height={16} rx={2} {...common} />
            <Path d="m2 7 10 6 10-6" {...common} />
          </>
        );
      case 'map-pin':
        return (
          <>
            <Path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0Z" {...common} />
            <Circle cx={12} cy={10} r={3} {...common} />
          </>
        );
      case 'settings':
        return (
          <>
            <Circle cx={12} cy={12} r={3} {...common} />
            <Path
              d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
              {...common}
            />
          </>
        );
      case 'logout':
        return (
          <>
            <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" {...common} />
            <Polyline points="16 17 21 12 16 7" {...common} />
            <Line x1={21} y1={12} x2={9} y2={12} {...common} />
          </>
        );
      case 'lock':
        return (
          <>
            <Rect x={3} y={11} width={18} height={11} rx={2} {...common} />
            <Path d="M7 11V7a5 5 0 0 1 10 0v4" {...common} />
          </>
        );
      case 'eye':
        return (
          <>
            <Path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" {...common} />
            <Circle cx={12} cy={12} r={3} {...common} />
          </>
        );
      case 'eye-off':
        return (
          <>
            <Path d="M9.9 4.2A10.9 10.9 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.6 3.8M6.6 6.6A18.5 18.5 0 0 0 1 12s4 8 11 8a10.9 10.9 0 0 0 5.4-1.4" {...common} />
            <Path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" {...common} />
            <Line x1={2} y1={2} x2={22} y2={22} {...common} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {body()}
    </Svg>
  );
}

import type { ReactNode } from 'react';

import type { TailwindThemeClasses } from '../../lib/boardThemes';

type Props = {
  file: string;
  rank: string;
  isLight: boolean;
  children?: ReactNode;
  showCoordinates?: boolean;
  showFileCoordinate?: boolean;
  showRankCoordinate?: boolean;
  onClick?: () => void;
  highlightType?: 'none' | 'last-move' | 'selectable';
  badge?: ReactNode;
  layoutMode?: 'flex' | 'grid';
  themeColors?: TailwindThemeClasses;
};

export function Square({
  file,
  rank,
  isLight,
  children,
  showCoordinates = false,
  showFileCoordinate = false,
  showRankCoordinate = false,
  onClick,
  highlightType = 'none',
  badge,
  layoutMode = 'flex',
  themeColors,
}: Props) {
  const defaultColors = {
    light: 'bg-stone-200 dark:bg-stone-300',
    dark: 'bg-stone-600 dark:bg-stone-700',
    lightCoordinates: 'text-stone-700 dark:text-stone-800',
    darkCoordinates: 'text-stone-300 dark:text-stone-200',
  };
  const colors = themeColors || defaultColors;

  const squareColorClass = isLight ? colors.light : colors.dark;

  const highlightClass =
    highlightType === 'last-move'
      ? 'ring-2 ring-yellow-400 ring-inset'
      : highlightType === 'selectable'
        ? 'ring-2 ring-foreground/50 ring-inset'
        : '';

  const coordinateColorClass = isLight ? colors.lightCoordinates : colors.darkCoordinates;

  const sizeClass = layoutMode === 'grid' ? 'aspect-square' : 'w-[12.5%] h-full';

  return (
    <div
      className={`
        ${sizeClass} relative flex items-center justify-center
        ${squareColorClass}
        ${highlightClass}
        ${onClick ? 'cursor-pointer hover:opacity-80' : ''}
        ${layoutMode === 'grid' ? 'transition-colors select-none' : ''}
      `}
      onClick={onClick}
    >
      <div className="flex items-center justify-center w-full h-full">{children}</div>

      {showCoordinates && showRankCoordinate && (
        <div
          className={`absolute left-0.5 top-0.5 text-[0.6rem] sm:text-xs font-semibold pointer-events-none ${coordinateColorClass}`}
        >
          {rank}
        </div>
      )}
      {showCoordinates && showFileCoordinate && (
        <div
          className={`absolute right-0.5 bottom-0.5 text-[0.6rem] sm:text-xs font-semibold pointer-events-none ${coordinateColorClass}`}
        >
          {file}
        </div>
      )}

      {badge && <div className="absolute -right-1 -top-1 z-10 pointer-events-none">{badge}</div>}
    </div>
  );
}

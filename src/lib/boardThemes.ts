export type BoardTheme = 'default' | 'lichess' | 'chesscom';

export type TailwindThemeClasses = {
  light: string;
  dark: string;
  lightCoordinates: string;
  darkCoordinates: string;
};

export const boardThemes: Record<BoardTheme, TailwindThemeClasses> = {
  default: {
    light: 'bg-stone-200 dark:bg-stone-300',
    dark: 'bg-stone-600 dark:bg-stone-700',
    lightCoordinates: 'text-stone-700 dark:text-stone-800',
    darkCoordinates: 'text-stone-300 dark:text-stone-200',
  },
  lichess: {
    light: 'bg-[#f0d9b5] dark:bg-[#f0d9b5]',
    dark: 'bg-[#b58863] dark:bg-[#b58863]',
    lightCoordinates: 'text-[#b58863] dark:text-[#b58863]',
    darkCoordinates: 'text-[#f0d9b5] dark:text-[#f0d9b5]',
  },
  chesscom: {
    light: 'bg-[#eeeed2] dark:bg-[#eeeed2]',
    dark: 'bg-[#769656] dark:bg-[#769656]',
    lightCoordinates: 'text-[#769656] dark:text-[#769656]',
    darkCoordinates: 'text-[#eeeed2] dark:text-[#eeeed2]',
  },
};

export function getBoardThemeColors(theme: BoardTheme): TailwindThemeClasses {
  return boardThemes[theme];
}

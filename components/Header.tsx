import { Montserrat } from 'next/font/google';
import clsx from 'clsx'

interface HeaderProps {
  label: string;
}

const font = Montserrat({
  subsets: ['latin'],
  weight: ['600'],
});

const Header = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-3 items-center justify-center">
      <h1 className={clsx('text-4xl font-semibold text-white', font.className)}>S T O I C</h1>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
};

export default Header;

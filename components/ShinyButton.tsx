import Link from 'next/link';
import styles from './styles/button.module.css';

const ShinyButton = ({href, text}: {href: string, text: string}) => {
  return (
    <div>
      <Link href={href}>
        <button className={styles.button} >{text}</button>
      </Link>
    </div>
  );
};
export default ShinyButton;
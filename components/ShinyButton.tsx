import Link from 'next/link';
import styles from './styles/button.module.css';

const ShinyButton = ({href, text}: {href?: string, text: string}) => {
  return (
    <div>
        {href ?
            <Link href={href}>
                <button className={styles.button} >{text}</button>
            </Link>
        :
            <button className={styles.button} >{text}</button>
        }

    </div>
  );
};
export default ShinyButton;
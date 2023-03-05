import styles from './styles.module.scss';
import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link';

export function Header() {
	let currentDate = format(new Date(), 'EEEEEE, d MMMM', {
		locale: ptBR
	});
	return (
		<header className={styles.headerContainer}>
			<Link href='/'>
				<button type='button'>
					<img src='/logo.svg' alt='Logo' />
				</button>
			</Link>

			<p>O melhor para vc ouvir sempre.</p>
			<span>{currentDate}</span>
		</header>
	);
}

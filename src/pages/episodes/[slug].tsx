import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { api } from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import styles from './episode.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { PlayerContext } from '../../contexts/PlayerContexts';
import { useContext } from 'react';

type Episode = {
	id: string;
	title: string;
	thumbnail: string;
	members: string;
	durationAsString: string;
	duration: number;
	description: string;
	url: string;
	publishedAt: string;
	thumbnailFileName: string;
};

type EpisodeProps = {
	episode: Episode;
};

export default function Episode({ episode }: EpisodeProps) {
	const { play } = useContext(PlayerContext);
	const router = useRouter();
	const myLoader = ({ src, width, height, quality }) => {
		return `https://storage.googleapis.com/golden-wind/nextlevelweek/05-podcastr/${src}?w=${width}?h=${height}&q=${
			quality || 75
		}`;
	};

	return (
		<div className={styles.episode}>
			<div className={styles.thumbnailContainer}>
				<Link href='/'>
					<button type='button'>
						<img src='/arrow-left.svg' alt='Voltar' />
					</button>
				</Link>
				<Image
					loader={myLoader}
					width={700}
					height={160}
					src={episode.thumbnailFileName}
					alt={episode.title}
					quality={100}
				/>
				<button type='button'>
					<img
						src='/play.svg'
						alt='Tocar Episódio'
						onClick={() => play(episode)}
					/>
				</button>
			</div>

			<header>
				<h1>{episode.title}</h1>
				<span>{episode.members}</span>
				<span>{episode.publishedAt}</span>
				<span>{episode.durationAsString}</span>
			</header>
			<div
				className={styles.description}
				dangerouslySetInnerHTML={{ __html: episode.description }}
			/>
		</div>
	);
}

export const getStaticPaths: GetStaticPaths = async () => {
	return {
		paths: [],
		fallback: 'blocking'
	};
};

export const getStaticProps: GetStaticProps = async (ctx) => {
	const { slug } = ctx.params;

	const { data } = await api.get(`/episodes/${slug}`);

	const episode = {
		id: data.id,
		title: data.title,
		thumbnail: data.thumbnail,
		members: data.members,
		publishedAt: format(parseISO(data.published_at), 'd MMM yy', {
			locale: ptBR
		}),
		duration: Number(data.file.duration),
		description: data.description,
		durationAsString: convertDurationToTimeString(Number(data.file.duration)),
		thumbnailFileName: data.thumbnail.split('/').pop(),
		url: data.file.url
	};

	return {
		props: { episode },
		revalidate: 60 * 60 * 24 //24 horas
	};
};

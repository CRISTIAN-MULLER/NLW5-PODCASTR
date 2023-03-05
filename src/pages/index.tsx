import { GetStaticProps } from 'next';
import { useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import styles from './home.module.scss';
import { PlayerContext } from '../contexts/PlayerContexts';
import { Episode } from '../types/Episode.type';

type HomeProps = {
	latestEpisodes: Episode[];
	allEpisodes: Episode[];
};

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
	const { play } = useContext(PlayerContext);

	return (
		<div className={styles.homePage}>
			<section className={styles.latestEpisodes}>
				<h2>Últimos Lançamentos</h2>
				<ul>
					{latestEpisodes.map((episode) => {
						const myLoader = ({ src, width, height, quality }) => {
							return `https://storage.googleapis.com/golden-wind/nextlevelweek/05-podcastr/${src}?w=${width}?h=${height}&q=${
								quality || 75
							}`;
						};

						return (
							<li key={episode.id}>
								<Image
									loader={myLoader}
									width={256}
									height={256}
									src={episode.thumbnailFileName}
									alt={episode.title}
									quality={100}
								/>
								<div className={styles.episodeDetails}>
									<Link href={`/episodes/${episode.id}`}>{episode.title}</Link>
									<p>{episode.members}</p>

									<span>{episode.publishedAt}</span>
									<span>{episode.durationAsString}</span>
								</div>
								<button type='button' onClick={() => play(episode)}>
									<img src='/play-green.svg' alt='Tocar Episódio' />
								</button>
							</li>
						);
					})}
				</ul>
			</section>

			<section className={styles.allEpisodes}>
				<h2>Todos os Episódios</h2>
				<table cellSpacing={0}>
					<thead>
						<tr>
							<th></th>
							<th>Podcast</th>
							<th>Integrantes</th>
							<th>Data</th>
							<th>Duração</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{allEpisodes.map((episode) => {
							const myLoader = ({ src, width, height, quality }) => {
								return `https://storage.googleapis.com/golden-wind/nextlevelweek/05-podcastr/${src}?w=${width}?h=${height}&q=${
									quality || 75
								}`;
							};
							return (
								<tr key={episode.id}>
									<td style={{ width: 72 }}>
										<Image
											loader={myLoader}
											width={256}
											height={256}
											src={episode.thumbnailFileName}
											alt={episode.title}
											quality={100}
										/>
									</td>
									<td>
										<Link href={`/episodes/${episode.id}`}>
											{episode.title}
										</Link>
									</td>
									<td>{episode.members}</td>
									<td style={{ width: 100 }}>{episode.publishedAt}</td>
									<td>{episode.durationAsString}</td>
									<td>
										<button type='button' onClick={() => play(episode)}>
											<img src='/play-green.svg' alt='Tocar episódio' />
										</button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</section>
		</div>
	);
}

export const getStaticProps: GetStaticProps = async () => {
	const { data } = await api.get('episodes', {
		params: { limit: 12 }
	});

	const episodes = data.map((episode) => {
		return {
			id: episode.id,
			title: episode.title,
			thumbnail: episode.thumbnail,
			members: episode.members,
			publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {
				locale: ptBR
			}),
			duration: Number(episode.file.duration),
			durationAsString: convertDurationToTimeString(
				Number(episode.file.duration)
			),
			thumbnailFileName: episode.thumbnail.split('/').pop(),
			url: episode.file.url
		};
	});

	const latestEpisodes = episodes.slice(0, 2);
	const allEpisodes = episodes.slice(2, episodes.length);

	return {
		props: {
			latestEpisodes,
			allEpisodes
		},
		revalidate: 60 * 60 * 8 // 8 horas
	};
};

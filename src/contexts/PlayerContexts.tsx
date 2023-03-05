import { createContext } from 'react';
import { Episode } from '../types/Episode.type';

type PlayerContextData = {
	episodeList: Episode[];
	currentEpisodeIndex: number;
	isPlaying: boolean;
	play: (episode: Episode) => void;
	togglePlay: () => void;
	setIsPlayingState: (state: boolean) => void;
};

export const PlayerContext = createContext({} as PlayerContextData);

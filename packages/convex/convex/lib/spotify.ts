"use node";

import { type SearchResult, searchAndGetLinks } from "spotify-find-preview";
import { z } from "zod";

// Spotify API response schemas
const spotifyImageSchema = z.object({
	url: z.string(),
	height: z.number().nullable(),
	width: z.number().nullable(),
});

const spotifyArtistSchema = z.object({
	id: z.string(),
	name: z.string(),
});

const spotifyAlbumSchema = z.object({
	id: z.string(),
	name: z.string(),
	images: z.array(spotifyImageSchema),
});

const spotifyTrackSchema = z.object({
	track: z
		.object({
			id: z.string(),
			name: z.string(),
			artists: z.array(spotifyArtistSchema),
			album: spotifyAlbumSchema,
		})
		.nullable(),
});

const spotifyPlaylistTracksResponseSchema = z.object({
	items: z.array(spotifyTrackSchema),
	next: z.string().nullable(),
	total: z.number(),
});

export interface Track {
	id: string;
	name: string;
	artists: string[];
	albumImage?: string;
}

/**
 * Fetches all tracks from a Spotify playlist
 * @param playlistId - The Spotify playlist ID
 * @param accessToken - The Spotify access token
 * @returns Array of track data (without preview URLs)
 */
export async function fetchPlaylistTracks(
	playlistId: string,
	accessToken: string,
): Promise<Track[]> {
	const tracks: Track[] = [];
	let nextUrl: string | null =
		`https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100`;

	while (nextUrl) {
		const response = await fetch(nextUrl, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		if (!response.ok) {
			const error = await response.text();
			console.error("Spotify API error:", error);
			throw new Error(
				`Failed to fetch playlist tracks: ${response.statusText}`,
			);
		}

		const data = await response.json();
		const parsed = spotifyPlaylistTracksResponseSchema.parse(data);

		for (const item of parsed.items) {
			if (item.track) {
				tracks.push({
					id: item.track.id,
					name: item.track.name,
					artists: item.track.artists.map((a) => a.name),
					albumImage: item.track.album.images[0]?.url,
				});
			}
		}

		nextUrl = parsed.next;

		// Safety limit to prevent infinite loops
		if (tracks.length > 500) {
			break;
		}
	}

	return tracks;
}

/**
 * Fetch the preview URL for a track using spotify-find-preview.
 * If trackId is provided, find a previewUrl for that exact track in the results.
 * Otherwise, uses the first available preview URL.
 * Returns the first available preview URL or null.
 * If trackId is provided but not found, fall back to first match.
 */
export async function fetchTrackPreviewUrl(
	trackName: string,
	artists?: string[],
	trackId?: string,
): Promise<string | null> {
	const candidates = artists && artists.length > 0 ? artists : [null];

	for (const artist of candidates) {
		let result: SearchResult;
		if (artist !== null) {
			result = await searchAndGetLinks(trackName, artist, 5);
		} else {
			result = await searchAndGetLinks(trackName, 5);
		}

		if (result.success && result.results.length > 0) {
			let selectedTrack = result.results[0];

			if (trackId !== undefined) {
				const foundTrack = result.results.find(
					(track) => track.trackId === trackId,
				);

				if (foundTrack) {
					selectedTrack = foundTrack;
				}
				// If not found, selectedTrack remains as first match (fallback)
			}

			if (selectedTrack && selectedTrack.previewUrls.length > 0) {
				return selectedTrack.previewUrls[0] ?? null;
			}
		}
	}
	return null;
}

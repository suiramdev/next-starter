"use client";

import { api } from "@repo/convex/_generated/api";
import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSet,
	FieldTitle,
} from "@repo/ui/registry/new-york-v4/ui/field";
import { Form } from "@repo/ui/registry/new-york-v4/ui/form";
import { Input } from "@repo/ui/registry/new-york-v4/ui/input";
import {
	RadioGroup,
	RadioGroupItem,
} from "@repo/ui/registry/new-york-v4/ui/radio-group";
import { GlobeIcon, LockIcon } from "@repo/ui/registry/web/icons";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useDebouncedCallback } from "../../../hooks/use-debounce";
import { LinkSpotifyButton } from "../../spotify/components/link-spotify-button";
import { PlaylistSelectionSection } from "./playlist-selection-section";

interface CreateRoomFormValues {
	name: string;
	isPrivate: boolean;
	playlistId: string;
	playlistName: string;
	playlistImage?: string;
	playlistAuthor?: string | null;
	playlistTotalTracks?: number;
}

export function CreateRoomForm() {
	const session = authClient.useSession();
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

	const debouncedSearch = useDebouncedCallback((query: string) => {
		setDebouncedSearchQuery(query);
	}, 300);

	const handleSearchChange = (value: string) => {
		setSearchQuery(value);
		debouncedSearch(value);
	};

	const form = useForm<CreateRoomFormValues>({
		defaultValues: {
			name: session.data?.user?.name ? `${session.data.user.name}'s room` : "",
			isPrivate: false,
			playlistId: "",
			playlistName: "",
		},
		mode: "onChange",
	});

	const createRoom = useMutation(api.domains.rooms.mutations.createRoom);
	const hasSpotifyAccount = useQuery(
		api.domains.spotify.queries.hasSpotifyAccount,
	);

	const { isValid, isSubmitting } = form.formState;

	const onSubmit = async (data: CreateRoomFormValues) => {
		try {
			const roomId = await createRoom({
				name: data.name,
				isPrivate: data.isPrivate,
				playlistId: data.playlistId,
				playlistName: data.playlistName,
				playlistImage: data.playlistImage,
				playlistAuthor: data.playlistAuthor,
				playlistTotalTracks: data.playlistTotalTracks,
			});
			form.reset();
			router.push(`/rooms/${roomId}`);
			toast.success("Room created successfully");
		} catch (error) {
			toast.error("Failed to create room");
			console.error(error);
		}
	};

	return (
		<div className="w-full">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<FieldGroup>
						<Controller
							name="name"
							control={form.control}
							rules={{
								required: "Room name is required",
								minLength: {
									value: 1,
									message: "Room name cannot be empty",
								},
							}}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="room-name">
										Room Name <span className="text-destructive">*</span>
									</FieldLabel>
									<Input
										{...field}
										id="room-name"
										placeholder="My Awesome Room"
										aria-invalid={fieldState.invalid}
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
						<Controller
							name="isPrivate"
							control={form.control}
							render={({ field, fieldState }) => (
								<FieldSet data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="room-visibility">
										Room Visibility <span className="text-destructive">*</span>
									</FieldLabel>
									<FieldDescription>
										Choose whether your room is visible to everyone or only
										invited players.
									</FieldDescription>
									<RadioGroup
										value={field.value ? "private" : "public"}
										onValueChange={(value) =>
											field.onChange(value === "private")
										}
										aria-invalid={fieldState.invalid}
									>
										<FieldLabel htmlFor="visibility-public">
											<Field orientation="horizontal">
												<FieldContent>
													<FieldTitle className="flex items-center gap-2">
														<GlobeIcon className="size-4" />
														Public
													</FieldTitle>
													<FieldDescription>
														Anyone can discover and join your room.
													</FieldDescription>
												</FieldContent>
												<RadioGroupItem value="public" id="visibility-public" />
											</Field>
										</FieldLabel>
										<FieldLabel htmlFor="visibility-private">
											<Field orientation="horizontal">
												<FieldContent>
													<FieldTitle className="flex items-center gap-2">
														<LockIcon className="size-4" />
														Private
													</FieldTitle>
													<FieldDescription>
														Only players with an invite link can join your room.
													</FieldDescription>
												</FieldContent>
												<RadioGroupItem
													value="private"
													id="visibility-private"
												/>
											</Field>
										</FieldLabel>
									</RadioGroup>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</FieldSet>
							)}
						/>
						<Controller
							name="playlistId"
							control={form.control}
							rules={{
								required: "A playlist is required to create a room",
								validate: (value) => {
									const playlistName = form.getValues("playlistName");
									if (!value || !playlistName) {
										return "A playlist is required to create a room";
									}
									return true;
								},
							}}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<Field orientation="horizontal">
										<FieldLabel>
											Playlist <span className="text-destructive">*</span>
										</FieldLabel>
										{hasSpotifyAccount && (
											<Input
												type="search"
												placeholder="Search playlists..."
												value={searchQuery}
												onChange={(e) => handleSearchChange(e.target.value)}
												className="w-64"
											/>
										)}
									</Field>
									{hasSpotifyAccount ? (
										<>
											<PlaylistSelectionSection
												selectedPlaylistId={field.value}
												searchQuery={debouncedSearchQuery}
												onSelect={(id, name, image, author, totalTracks) => {
													field.onChange(id);
													if (name) {
														form.setValue("playlistName", name, {
															shouldValidate: true,
														});
													}
													if (image) {
														form.setValue("playlistImage", image);
													}
													if (author !== undefined) {
														form.setValue("playlistAuthor", author);
													}
													if (totalTracks !== undefined) {
														form.setValue("playlistTotalTracks", totalTracks);
													}
													form.trigger("playlistId");
												}}
											/>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</>
									) : (
										<div className="flex flex-col gap-2">
											<span className="text-muted-foreground text-sm">
												Please connect your Spotify account to select a
												playlist.
											</span>
											<LinkSpotifyButton className="w-full" />
										</div>
									)}
								</Field>
							)}
						/>
					</FieldGroup>
					<div className="flex justify-end gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => router.back()}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={!isValid || isSubmitting}>
							Create
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { CreateRoomDialog } from "@/features/lobby/components/create-room-dialog";
import { RoomList } from "@/features/lobby/components/room-list";
import { authClient } from "@/lib/auth-client";

export function LobbyClient() {
	const { data: session, isPending } = authClient.useSession();
	const router = useRouter();

	useEffect(() => {
		if (isPending) return;

		// If no session, try to sign in anonymously
		if (!session) {
			const signInAnonymously = async () => {
				try {
					await authClient.signIn.anonymous();
					toast.success("Signed in as guest");
				} catch (error) {
					console.error("Anonymous sign in failed", error);
					// If anon sign in fails (maybe not allowed?), redirect to sign in
					router.push("/sign-in");
				}
			};
			signInAnonymously();
		}
	}, [session, isPending, router]);

	if (isPending || !session) {
		return (
			<div className="flex h-screen items-center justify-center">
				Loading lobby...
			</div>
		);
	}

	return (
		<div className="container mx-auto py-8">
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="font-bold text-3xl">Game Lobby</h1>
					<p className="text-muted-foreground">
						Join a room or create your own
					</p>
				</div>
				<div className="flex items-center gap-4">
					<div className="text-sm">
						Logged in as <span className="font-bold">{session.user.name}</span>
					</div>
					<CreateRoomDialog />
				</div>
			</div>

			<RoomList />
		</div>
	);
}


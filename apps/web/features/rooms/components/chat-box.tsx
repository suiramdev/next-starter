"use client";

import { api } from "@repo/convex/_generated/api";
import type { Id } from "@repo/convex/_generated/dataModel";
import { Skeleton } from "@repo/ui/registry/new-york-v4/ui/skeleton";
import {
	ChatBubble,
	ChatContainer,
	ChatInput,
	ChatMessageList,
} from "@repo/ui/registry/web/chat";
import { useMutation } from "convex/react";
import { useEffect, useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";

interface ChatBoxProps {
	roomId: Id<"rooms">;
	messages?: Array<{
		id: string;
		creationTime: number;
		content: string;
		userId: string;
		user?: {
			id: string;
			name: string;
			image?: string;
		};
	}>;
	isLoading?: boolean;
}

export function ChatBox({ roomId, messages = [], isLoading }: ChatBoxProps) {
	const { data: session } = authClient.useSession();
	const currentUserId = session?.user?.id;

	const sendMessage = useMutation(
		api.domains.messages.mutations.sendMessage,
	).withOptimisticUpdate((localStore, args) => {
		const existingMessages = localStore.getQuery(
			api.domains.messages.queries.listMessages,
			{ roomId },
		);

		if (existingMessages !== undefined) {
			const now = Date.now();
			const newMessage = {
				id: crypto.randomUUID() as Id<"messages">,
				creationTime: now,
				content: args.content,
				userId: currentUserId ?? "",
				user: session?.user
					? {
							id: session.user.id,
							name: session.user.name ?? "Unknown",
							image: session.user.image ?? undefined,
						}
					: undefined,
			};

			localStore.setQuery(
				api.domains.messages.queries.listMessages,
				{ roomId },
				[...existingMessages, newMessage],
			);
		}
	});

	const [newMessage, setNewMessage] = useState("");
	const bottomRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	// Auto-scroll to bottom when new messages arrive
	// biome-ignore lint/correctness/useExhaustiveDependencies: Intentionally scroll when message count changes
	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages.length]);

	const handleSendMessage = () => {
		if (!newMessage.trim()) return;

		sendMessage({
			roomId,
			content: newMessage.trim(),
		});
		setNewMessage("");
		requestAnimationFrame(() => {
			inputRef.current?.focus();
		});
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	if (isLoading) {
		return (
			<ChatContainer>
				<ChatMessageList>
					{Array.from({ length: 3 }, (_, i) => `skeleton-chat-${i}`).map(
						(key) => (
							<div key={key} className="flex gap-2 p-2">
								<Skeleton className="h-8 w-8 shrink-0 rounded-full" />
								<div className="flex flex-1 flex-col gap-1">
									<Skeleton className="h-3 w-16" />
									<Skeleton className="h-12 w-48 rounded-lg" />
								</div>
							</div>
						),
					)}
				</ChatMessageList>
				<div className="flex gap-2 p-2">
					<Skeleton className="h-10 flex-1" />
					<Skeleton className="h-10 w-10" />
				</div>
			</ChatContainer>
		);
	}

	return (
		<ChatContainer>
			<ChatMessageList>
				{messages.map((message, index) => {
					const isOwnMessage = message.userId === currentUserId;
					const showAvatar =
						!isOwnMessage &&
						(index === 0 || messages[index - 1]?.userId !== message.userId);
					const showName = showAvatar;

					return (
						<ChatBubble
							key={message.id}
							content={message.content}
							isOwn={isOwnMessage}
							senderName={message.user?.name ?? "Unknown"}
							senderImage={message.user?.image ?? undefined}
							timestamp={message.creationTime}
							showAvatar={showAvatar}
							showName={showName}
						/>
					);
				})}
				<div ref={bottomRef} />
			</ChatMessageList>

			<ChatInput
				value={newMessage}
				onChange={setNewMessage}
				onSend={handleSendMessage}
				onKeyDown={handleKeyDown}
				inputRef={inputRef}
			/>
		</ChatContainer>
	);
}

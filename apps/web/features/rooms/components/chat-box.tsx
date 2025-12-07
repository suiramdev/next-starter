"use client";

import { api } from "@repo/convex/_generated/api";
import type { Id } from "@repo/convex/_generated/dataModel";
import {
	ChatBubble,
	ChatContainer,
	ChatInput,
	ChatMessageList,
} from "@repo/ui/registry/web/chat";
import { type Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { useEffect, useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";

interface ChatBoxProps {
	preloadedQuery: Preloaded<typeof api.domains.messages.queries.listMessages>;
	roomId: Id<"rooms">;
}

export function ChatBox({ preloadedQuery, roomId }: ChatBoxProps) {
	const { data: session } = authClient.useSession();
	const messages = usePreloadedQuery(preloadedQuery);

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
				_id: crypto.randomUUID() as Id<"messages">,
				_creationTime: now,
				content: args.content,
				userId: currentUserId ?? "",
				user: session?.user
					? {
							_id: session.user.id,
							name: session.user.name ?? "Unknown",
							image: session.user.image ?? null,
						}
					: null,
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
							key={message._id}
							content={message.content}
							isOwn={isOwnMessage}
							senderName={message.user?.name ?? "Unknown"}
							senderImage={message.user?.image ?? undefined}
							timestamp={message._creationTime}
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

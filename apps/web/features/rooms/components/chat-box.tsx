"use client";

import { api } from "@repo/convex/_generated/api";
import type { Id } from "@repo/convex/_generated/dataModel";
import {
	ChatBubble,
	ChatContainer,
	ChatEmptyState,
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
	const sendMessage = useMutation(api.domains.messages.mutations.sendMessage);

	const [newMessage, setNewMessage] = useState("");
	const [isSending, setIsSending] = useState(false);
	const bottomRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const currentUserId = session?.user?.id;

	// Auto-scroll to bottom when new messages arrive
	// biome-ignore lint/correctness/useExhaustiveDependencies: Intentionally scroll when message count changes
	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages.length]);

	const handleSendMessage = async () => {
		if (!newMessage.trim() || isSending) return;

		setIsSending(true);
		try {
			await sendMessage({
				roomId,
				content: newMessage.trim(),
			});
			setNewMessage("");
		} finally {
			setIsSending(false);
			// Focus after state updates are processed
			requestAnimationFrame(() => {
				inputRef.current?.focus();
			});
		}
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
				{messages.length === 0 ? (
					<ChatEmptyState />
				) : (
					messages.map((message, index) => {
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
					})
				)}
				<div ref={bottomRef} />
			</ChatMessageList>

			<ChatInput
				value={newMessage}
				onChange={setNewMessage}
				onSend={handleSendMessage}
				onKeyDown={handleKeyDown}
				inputRef={inputRef}
				disabled={isSending}
			/>
		</ChatContainer>
	);
}

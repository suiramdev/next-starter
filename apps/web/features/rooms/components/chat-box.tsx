"use client";

import {
	ChatBubble,
	ChatContainer,
	ChatEmptyState,
	ChatInput,
	ChatMessageList,
} from "@repo/ui/registry/web/chat";
import { useEffect, useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";

interface Message {
	id: string;
	content: string;
	senderId: string;
	senderName: string;
	senderImage?: string;
	timestamp: number;
}

// Mock messages for demonstration - will be replaced with Convex query
const MOCK_MESSAGES: Message[] = [
	{
		id: "1",
		content: "Hey everyone! Ready for some music trivia? 🎵",
		senderId: "user-1",
		senderName: "Alex",
		timestamp: Date.now() - 300000,
	},
	{
		id: "2",
		content: "Absolutely! Let's go 🔥",
		senderId: "user-2",
		senderName: "Jordan",
		timestamp: Date.now() - 240000,
	},
	{
		id: "3",
		content: "I've been practicing my 80s rock knowledge",
		senderId: "user-3",
		senderName: "Sam",
		timestamp: Date.now() - 180000,
	},
	{
		id: "4",
		content: "Oh no, 80s rock is my weakness 😅",
		senderId: "user-2",
		senderName: "Jordan",
		timestamp: Date.now() - 120000,
	},
	{
		id: "5",
		content: "Don't worry, we've got a good mix in the playlist!",
		senderId: "user-1",
		senderName: "Alex",
		timestamp: Date.now() - 60000,
	},
];

export function ChatBox() {
	const { data: session } = authClient.useSession();
	const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
	const [newMessage, setNewMessage] = useState("");
	const bottomRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const currentUserId = session?.user?.id ?? "user-1";

	// Auto-scroll to bottom when new messages arrive
	// biome-ignore lint/correctness/useExhaustiveDependencies: Intentionally scroll when message count changes
	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages.length]);

	const handleSendMessage = () => {
		if (!newMessage.trim()) return;

		const message: Message = {
			id: crypto.randomUUID(),
			content: newMessage.trim(),
			senderId: currentUserId,
			senderName: session?.user?.name ?? "You",
			senderImage: session?.user?.image ?? undefined,
			timestamp: Date.now(),
		};

		setMessages((prev) => [...prev, message]);
		setNewMessage("");
		inputRef.current?.focus();
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
						const isOwnMessage = message.senderId === currentUserId;
						const showAvatar =
							!isOwnMessage &&
							(index === 0 ||
								messages[index - 1]?.senderId !== message.senderId);
						const showName = showAvatar;

						return (
							<ChatBubble
								key={message.id}
								content={message.content}
								isOwn={isOwnMessage}
								senderName={message.senderName}
								senderImage={message.senderImage}
								timestamp={message.timestamp}
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
			/>
		</ChatContainer>
	);
}

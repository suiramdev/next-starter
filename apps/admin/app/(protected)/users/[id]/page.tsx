type UserPageProps = {
	params: Promise<{ id: string }>;
};

export default async function UserPage({ params }: UserPageProps) {
	const { id } = await params;

	return (
		<section>
			<h1 className="mb-4 font-bold text-2xl">User Profile</h1>
		</section>
	);
}

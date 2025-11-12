import { Building2Icon } from "@repo/ui/registry/admin/icons";

type OrganizationAvatarProps = {
	organization: {
		image?: string | null;
		name?: string | null;
	};
};

// Determine a pale color based on the organization name
const getBackgroundColor = (name: string) => {
	const hash = name
		.split("")
		.reduce((acc, char) => acc + char.charCodeAt(0), 0);
	// Use a pastel/pale color: full saturation, high lightness (e.g. 85%)
	return `hsl(${hash % 360}, 100%, 85%)`;
};

// Determine a dark color based on the organization name
const getTextColor = (name: string) => {
	const hash = name
		.split("")
		.reduce((acc, char) => acc + char.charCodeAt(0), 0);
	return `hsl(${hash % 360}, 100%, 20%)`;
};

export function OrganizationAvatar({ organization }: OrganizationAvatarProps) {
	return (
		<div
			className="flex aspect-square size-8 items-center justify-center rounded-lg"
			style={{
				backgroundColor: getBackgroundColor(organization.name ?? ""),
				color: getTextColor(organization.name ?? ""),
			}}
		>
			<Building2Icon
				className="size-4"
				style={{ color: getTextColor(organization.name ?? "") }}
			/>
		</div>
	);
}

import { OrganizationSettingsForm } from "@/features/organizations/components/organization-settings-form";

export default function SettingsPage() {
	return (
		<section>
			<div className="mb-6">
				<h1 className="mb-2 font-bold text-2xl">Organization Settings</h1>
			</div>
			<OrganizationSettingsForm />
		</section>
	);
}

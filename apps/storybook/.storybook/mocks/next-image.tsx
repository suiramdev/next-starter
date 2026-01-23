import type React from "react";

const NextImage = (props: any) => {
	const { fill, width, height, src, alt, ...rest } = props;

	const style: React.CSSProperties = fill
		? {
				position: "absolute",
				height: "100%",
				width: "100%",
				inset: 0,
				objectFit: "cover",
			}
		: { height, width };

	// biome-ignore lint/a11y/useAltText: This is a mock for Storybook
	return (
		<img src={src} alt={alt} style={{ ...style, ...rest.style }} {...rest} />
	);
};

export default NextImage;

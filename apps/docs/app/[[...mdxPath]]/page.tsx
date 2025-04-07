import { generateStaticParamsFor, importPage } from "nextra/pages";
import { useMDXComponents as getMDXComponents } from "../../mdx-components";

// Define types for the params
type Params = {
  mdxPath: string[];
};

// Type the generateStaticParams function
export const generateStaticParams = generateStaticParamsFor("mdxPath");

// Type the generateMetadata function
export async function generateMetadata({ params }: { params: Params }) {
  const { metadata } = await importPage(params.mdxPath);
  return metadata;
}

const Wrapper = getMDXComponents().wrapper;

// Type the Page component
export default async function Page(props: {
  params: Params;
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const params = await props.params;
  const result = await importPage(params.mdxPath);
  const { default: MDXContent, toc, metadata } = result;
  return (
    <Wrapper toc={toc} metadata={metadata}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  );
}

import { Container, Title, Text, Paper, Badge, Group, Button, Stack } from "@mantine/core";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

// Route-level ISR: revalidate every 360 seconds
export const revalidate = 360;

// Allow dynamic params to be generated on-demand
export const dynamicParams = true;

interface Post {
	title: string;
	slug: string;
	author: string;
	published: boolean;
	created_at: string;
	updated_at: string;
	image?: string;
}

interface PostContent {
	content: string;
}

async function getPost(slug: string): Promise<Post | null> {
	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blogs/${slug}`, {
			next: { revalidate: 3600 }, // Revalidate every 3600 seconds
		});

		if (!res.ok) {
			return null;
		}

		const data: { blog: Post } = await res.json();
		return data.blog || null;
	} catch (error) {
		return null;
	}
}

async function getPostContent(slug: string): Promise<string | null> {
	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blogs/${slug}/content`, {
			next: { revalidate: 3600 }, // Revalidate every 3600 seconds
		});

		if (!res.ok) {
			return null;
		}

		const data: { content: string } = await res.json();
		return data.content || null;
	} catch (error) {
		return null;
	}
}

export async function generateStaticParams() {
	// Pre-generate all 1000 posts at build time
	return Array.from({ length: 1000 }, (_, i) => ({
		id: `blog-post-${i + 1}`,
	}));
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const post = await getPost(id);

	if (!post) {
		notFound();
	}

	const content = await getPostContent(id);

	return (
		<Container size="md" py="xl">
			<Stack gap="xl">
				<Link href="/" style={{ textDecoration: "none" }}>
					<Button variant="subtle" size="sm">
						← Back to all posts
					</Button>
				</Link>

				<Paper shadow="sm" p={0} radius="md" withBorder>
					{post.image && (
						<div style={{ position: "relative", width: "100%", height: "500px", overflow: "hidden", borderTopLeftRadius: "8px", borderTopRightRadius: "8px" }}>
							<Image
								src={post.image}
								alt={post.title}
								fill
								style={{ objectFit: "cover" }}
								priority
								unoptimized
							/>
						</div>
					)}

					<Stack gap="lg" p="xl">
						<Group justify="space-between" align="flex-start">
							<Badge color="blue" variant="filled" size="lg">
								{post.slug}
							</Badge>
							<Badge color={post.published ? "green" : "gray"} variant="light">
								{post.published ? "Published" : "Draft"}
							</Badge>
						</Group>

						<Title order={1} size="h1">
							{post.title}
						</Title>

						<Group gap="xl">
							<Group gap="xs">
								<Text size="sm" fw={500}>
									Author:
								</Text>
								<Text size="sm" c="dimmed">
									{post.author}
								</Text>
							</Group>
							<Group gap="xs">
								<Text size="sm" fw={500}>
									Published:
								</Text>
								<Text size="sm" c="dimmed">
									{new Date(post.created_at).toLocaleDateString("en-US", {
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</Text>
							</Group>
						</Group>

						{post.updated_at !== post.created_at && (
							<Text size="xs" c="dimmed" fs="italic">
								Last updated: {new Date(post.updated_at).toLocaleDateString("en-US", {
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
							</Text>
						)}

						{content && (
							<>
								<div style={{ borderTop: "1px solid #e9ecef", marginTop: "1rem", paddingTop: "1.5rem" }} />
								<Text size="md" style={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}>
									{content}
								</Text>
							</>
						)}
					</Stack>
				</Paper>
			</Stack>
		</Container>
	);
}

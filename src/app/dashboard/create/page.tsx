import { Editor } from "@/src/components/Editor";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/src/lib/auth";

export default async function CreatePostPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "author") {
    redirect("/dashboard");
  }

  return (
    <section className="writer-page">
      <div className="page-heading">
        <p className="eyebrow">Author studio</p>
        <h1>Create post</h1>
      </div>
      <Editor />
    </section>
  );
}

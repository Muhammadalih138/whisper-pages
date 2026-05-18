import { connectToDatabase } from "@/src/lib/db";
import { hashPassword } from "@/src/lib/password";
import { User } from "@/src/models/User";

const roles = new Set(["reader", "author"]);

export async function POST(request: Request) {
  const body = await request.json();
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").toLowerCase().trim();
  const password = String(body.password ?? "");
  const role = roles.has(body.role) ? body.role : "reader";

  if (!name || !email || password.length < 8) {
    return Response.json(
      { message: "Name, email, and an 8 character password are required." },
      { status: 400 },
    );
  }

  await connectToDatabase();
  const existingUser = await User.findOne({ email }).lean();

  if (existingUser) {
    return Response.json(
      { message: "An account already exists for this email." },
      { status: 409 },
    );
  }

  await User.create({
    name,
    email,
    passwordHash: await hashPassword(password),
    role,
  });

  return Response.json({ ok: true }, { status: 201 });
}

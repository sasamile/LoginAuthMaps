import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  console.log(token);

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  //verificar token
  try {
    const verificationToken = await db.passwordResetToken.findFirst({
      where: {
        token: token,
      },
    });

    if (!verificationToken) {
      return new Response("Invalid token", { status: 400 });
    }

    if (verificationToken.expires < new Date()) {
      return new Response("Token expired", { status: 400 });
    }

    const user = await db.user.findUnique({
      where: {
        email: verificationToken.identifier,
      },
    });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        passwordVerified: new Date(),
      },
    });

    await db.passwordResetToken.delete({
      where: {
        identifier: verificationToken.identifier,
        token: verificationToken.token,
      },
    });


    return NextResponse.redirect(
      new URL(`/password-verify?email=${user.email}`, request.url)
    );
  } catch (error) {
    console.error("Error verifying email:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

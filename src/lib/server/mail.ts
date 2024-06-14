import { env } from "$env/dynamic/private";
import { Resend } from "resend";

export const resend = new Resend(env.RESEND_API_KEY);

type SendSignInCodeProps = {
	email: string;
	code: string;
};

export const sendSignInCode = ({ email, code }: SendSignInCodeProps) => {
	return resend.emails.send({
		to: email,
		from: "noreply@pallad.co",
		subject: "Mygram Sign In",
		text: `Verification code: ${code}`,
	});
};

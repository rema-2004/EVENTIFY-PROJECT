<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f6fb; padding: 32px;">
    <table role="presentation" width="100%" style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden;">
        <tr>
            <td style="background-color: #1E2761; padding: 24px; text-align: center;">
                <span style="color: #ffffff; font-size: 22px; font-weight: bold;">EVENTIFY</span>
            </td>
        </tr>
        <tr>
            <td style="padding: 32px;">
                <h2 style="color: #1A1A2E; margin-top: 0;">Reset Your Password</h2>
                <p style="color: #434B63; line-height: 1.6;">
                    We received a request to reset your Eventify account password.
                    Click the button below to choose a new one. This link will
                    expire in 60 minutes.
                </p>
                <div style="text-align: center; margin: 32px 0;">
                    <a href="{{ $resetLink }}"
                       style="background-color: #1E2761; color: #ffffff; padding: 12px 28px;
                              border-radius: 24px; text-decoration: none; font-weight: bold; display: inline-block;">
                        Reset Password
                    </a>
                </div>
                <p style="color: #6B7280; font-size: 13px; line-height: 1.6;">
                    If you didn't request this, you can safely ignore this email —
                    your password will remain unchanged.
                </p>
                <p style="color: #6B7280; font-size: 12px; word-break: break-all;">
                    Or copy this link: {{ $resetLink }}
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
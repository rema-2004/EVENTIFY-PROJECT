<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Confirm Your New Email</title>
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
                <h2 style="color: #1A1A2E; margin-top: 0;">Confirm Your New Email</h2>
                <p style="color: #434B63; line-height: 1.6;">
                    You asked to use this address as your Eventify login email.
                    Click the button below to confirm it. This link will
                    expire in 60 minutes.
                </p>
                <div style="text-align: center; margin: 32px 0;">
                    <a href="{{ $confirmLink }}"
                       style="background-color: #1E2761; color: #ffffff; padding: 12px 28px;
                              border-radius: 24px; text-decoration: none; font-weight: bold; display: inline-block;">
                        Confirm Email
                    </a>
                </div>
                <p style="color: #6B7280; font-size: 13px; line-height: 1.6;">
                    If you didn't ask for this, ignore this email. Your account
                    keeps its current address.
                </p>
                <p style="color: #6B7280; font-size: 12px; word-break: break-all;">
                    Or copy this link: {{ $confirmLink }}
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
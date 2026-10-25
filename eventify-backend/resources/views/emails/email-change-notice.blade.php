<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Email Change Requested</title>
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
                <h2 style="color: #1A1A2E; margin-top: 0;">Email Change Requested</h2>
                <p style="color: #434B63; line-height: 1.6;">
                    Someone asked to change the login email of your Eventify
                    account to <strong>{{ $newEmail }}</strong>. Nothing changes
                    until that address is confirmed.
                </p>
                <p style="color: #6B7280; font-size: 13px; line-height: 1.6;">
                    If this was not you, change your password now: your current
                    email is still the one used to sign in.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
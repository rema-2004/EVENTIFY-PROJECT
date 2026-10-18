<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Your event was not approved</title>
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
                <h2 style="color: #1A1A2E; margin-top: 0;">Your event was not approved</h2>
                <p style="color: #434B63; line-height: 1.6;">
                    Hello {{ $organizationName }},
                </p>
                <p style="color: #434B63; line-height: 1.6;">
                    After review, your event <strong>{{ $eventTitle }}</strong> was not approved
                    for publishing. Here is the reason from our review team:
                </p>
                <div style="background-color: #f4f6fb; border-left: 4px solid #1E2761; padding: 16px; margin: 24px 0; color: #1A1A2E; line-height: 1.6;">
                    {!! nl2br(e($reason)) !!}
                </div>
                <p style="color: #434B63; line-height: 1.6;">
                    You can edit the event to address this feedback and submit it
                    again for review from your organization dashboard.
                </p>
                <p style="color: #6B7280; font-size: 13px; line-height: 1.6;">
                    If you have questions about this decision, please contact our support team.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
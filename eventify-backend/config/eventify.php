<?php

return [

    /*
    | Attempts per minute for the sensitive endpoints (login, register,
    | password reset and change, profile update). Keep it low in production.
    | Automated test runs (Postman) call these endpoints many times in a
    | minute, so raise it in the local .env only:  AUTH_THROTTLE_PER_MINUTE=200
    */
    'auth_throttle_per_minute' => (int) env('AUTH_THROTTLE_PER_MINUTE', 5),

];

/* EVENTIFY — single Tailwind theme for every page.
   Replaces the 37 copies of this config that used to live inside the HTML.
   Direction: high-contrast ink on paper, one accent (#FF4D2E), no brand gradient. */

tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                /* base */
                "background": "#FAFAF8",
                "surface": "#FAFAF8",
                "surface-bright": "#FFFFFF",
                "surface-dim": "#E8E6E1",
                "surface-container-lowest": "#FFFFFF",
                "surface-container-low": "#F4F3EF",
                "surface-container": "#EDEBE5",
                "surface-container-high": "#E4E1DA",
                "surface-container-highest": "#DAD7CE",
                "surface-variant": "#EDEBE5",
                "surface-tint": "#FF4D2E",

                /* text */
                "on-background": "#0E1116",
                "on-surface": "#0E1116",
                "on-surface-variant": "#4A5058",
                "outline": "#8C8880",
                "outline-variant": "#DCD9D2",
                "inverse-surface": "#0E1116",
                "inverse-on-surface": "#FAFAF8",
                "inverse-primary": "#FF8B76",

                /* accent — the only chromatic colour in the system */
                "primary": "#FF4D2E",
                "on-primary": "#FFFFFF",
                "primary-container": "#E23B1C",
                "on-primary-container": "#FFFFFF",
                "primary-fixed": "#FFE4DD",
                "primary-fixed-dim": "#FFC4B6",
                "on-primary-fixed": "#4A1004",
                "on-primary-fixed-variant": "#96240E",

                /* secondary = ink, used for emphasis blocks rather than a second hue */
                "secondary": "#0E1116",
                "on-secondary": "#FFFFFF",
                "secondary-container": "#1B2027",
                "on-secondary-container": "#FFFFFF",
                "secondary-fixed": "#E7E5E0",
                "secondary-fixed-dim": "#C9C6BF",
                "on-secondary-fixed": "#0E1116",
                "on-secondary-fixed-variant": "#3A4049",

                /* tertiary = muted ink for quiet metadata */
                "tertiary": "#4A5058",
                "on-tertiary": "#FFFFFF",
                "tertiary-container": "#3A4049",
                "on-tertiary-container": "#FFFFFF",
                "tertiary-fixed": "#E7E5E0",
                "tertiary-fixed-dim": "#C9C6BF",
                "on-tertiary-fixed": "#0E1116",
                "on-tertiary-fixed-variant": "#3A4049",

                /* status */
                "success": "#1E7A4F",
                "on-success": "#FFFFFF",
                "success-container": "#D8EFE3",
                "on-success-container": "#0B3D27",
                "error": "#B3261E",
                "on-error": "#FFFFFF",
                "error-container": "#F9DEDC",
                "on-error-container": "#601410"
            },
            borderRadius: {
                DEFAULT: "6px",
                lg: "10px",
                xl: "16px",
                full: "9999px"
            },
            spacing: {
                "base": "4px",
                "xs": "4px",
                "sm": "8px",
                "md": "16px",
                "lg": "24px",
                "xl": "32px",
                "2xl": "48px",
                "gutter": "24px",
                "margin_mobile": "20px",
                "container-margin-mobile": "20px",
                "container-margin-desktop": "48px",
                "container_max_width": "1280px",
                "sidebar_width": "280px",
                "stack_gap_sm": "8px",
                "stack_gap_md": "20px",
                "stack_gap_lg": "40px",
                "top_nav_height": "72px"
            },
            fontFamily: {
                "display": ["Outfit"],
                "display-lg": ["Outfit"],
                "headline-xl": ["Outfit"],
                "headline-lg": ["Outfit"],
                "headline-lg-mobile": ["Outfit"],
                "headline-md": ["Outfit"],
                "title-lg": ["Outfit"],
                "title-md": ["Outfit"],
                "body": ["Inter"],
                "body-lg": ["Inter"],
                "body-md": ["Inter"],
                "body-sm": ["Inter"],
                "label-lg": ["Inter"],
                "label-md": ["Inter"],
                "label-sm": ["Inter"]
            },
            fontSize: {
                "display-lg": ["clamp(44px,7vw,84px)", { lineHeight: "0.95", letterSpacing: "-0.04em", fontWeight: "800" }],
                "headline-xl": ["clamp(36px,5vw,64px)", { lineHeight: "1.02", letterSpacing: "-0.035em", fontWeight: "800" }],
                "headline-lg": ["clamp(30px,4vw,48px)", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "700" }],
                "headline-lg-mobile": ["clamp(26px,6vw,34px)", { lineHeight: "1.1", letterSpacing: "-0.03em", fontWeight: "700" }],
                "headline-md": ["clamp(22px,2.6vw,30px)", { lineHeight: "1.15", letterSpacing: "-0.025em", fontWeight: "700" }],
                "title-lg": ["20px", { lineHeight: "28px", letterSpacing: "-0.015em", fontWeight: "600" }],
                "title-md": ["18px", { lineHeight: "26px", letterSpacing: "-0.01em", fontWeight: "600" }],
                "body-lg": ["18px", { lineHeight: "30px", fontWeight: "400" }],
                "body-md": ["16px", { lineHeight: "26px", fontWeight: "400" }],
                "body-sm": ["14px", { lineHeight: "22px", fontWeight: "400" }],
                "label-lg": ["15px", { lineHeight: "20px", fontWeight: "600" }],
                "label-md": ["14px", { lineHeight: "20px", letterSpacing: "0.005em", fontWeight: "600" }],
                "label-sm": ["12px", { lineHeight: "16px", letterSpacing: "0.06em", fontWeight: "700" }]
            }
        }
    }
};

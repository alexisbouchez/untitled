// Email-safe hex equivalents of the OKLCH design tokens from globals.css
// --primary: oklch(0.59 0.22 1)     → #be185d (rose)
// --foreground: oklch(0.145 0 0)    → #0a0a0a
// --muted-foreground: oklch(0.556 0 0) → #737373
// --border: oklch(0.922 0 0)        → #e5e5e5
// --muted/accent: oklch(0.97 0 0)   → #f5f5f5
// --background: oklch(1 0 0)        → #ffffff
// --radius: 0                       → sharp corners

const PRIMARY = "#be185d";
const FOREGROUND = "#0a0a0a";
const MUTED_FG = "#737373";
const BORDER = "#e5e5e5";
const MUTED = "#f5f5f5";
const BG = "#ffffff";

export function wrapNewsletter(subreddit: string, content: string): string {
  const date = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>r/${subreddit} digest — Hyperbulletin</title>
</head>
<body style="margin:0;padding:0;background-color:${MUTED};font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${FOREGROUND};">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${MUTED};">
<tr><td align="center" style="padding:40px 16px;">
<table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;width:100%;background-color:${BG};border:1px solid ${BORDER};">

<!-- Header -->
<tr><td style="padding:32px 40px;border-bottom:1px solid ${BORDER};">
<h1 style="margin:0;font-size:20px;font-weight:700;color:${FOREGROUND};letter-spacing:-0.5px;">Hyperbulletin</h1>
<p style="margin:6px 0 0;font-size:13px;color:${MUTED_FG};">r/${subreddit} &middot; ${date}</p>
</td></tr>

<!-- Content -->
<tr><td style="padding:32px 40px;">
${content}
</td></tr>

<!-- Footer -->
<tr><td style="padding:24px 40px;border-top:1px solid ${BORDER};">
<p style="margin:0;font-size:12px;color:${MUTED_FG};line-height:1.6;">
You received this because you requested a sample on <a href="https://hyperbulletin.com" style="color:${PRIMARY};text-decoration:none;">Hyperbulletin</a>.
</p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

// Inline style snippets for the LLM prompt, matching the design system
export const STYLE_GUIDE = `
- Section headings: <h2 style="margin:24px 0 8px;font-size:16px;font-weight:700;color:${FOREGROUND};letter-spacing:-0.3px;">
- Body text: <p style="margin:0 0 14px;font-size:14px;line-height:1.7;color:${FOREGROUND};">
- Links: <a href="..." style="color:${PRIMARY};text-decoration:none;">
- Section dividers: <hr style="border:none;border-top:1px solid ${BORDER};margin:24px 0;">
- Highlight/lead box: <div style="background-color:${MUTED};border-left:2px solid ${PRIMARY};padding:14px 18px;margin:0 0 14px;">
- Quick link list items: <li style="margin:0 0 6px;font-size:13px;line-height:1.6;color:${FOREGROUND};">
- Metadata (score, comments): <span style="font-size:12px;color:${MUTED_FG};">
- Muted secondary text: <p style="margin:0 0 14px;font-size:13px;line-height:1.6;color:${MUTED_FG};">`;

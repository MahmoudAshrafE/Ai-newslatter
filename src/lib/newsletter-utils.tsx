import { renderToStaticMarkup } from 'react-dom/server'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import React from 'react'

export const generateNewsletterHtml = (content: string) => {
    // Convert Markdown to HTML string
    const htmlContent = renderToStaticMarkup(
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    )

    // Add basic styling for email compatibility
    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
h1 { color: #2563eb; font-size: 24px; margin-bottom: 16px; }
h2 { color: #1e293b; font-size: 20px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-top: 32px; }
p { margin-bottom: 16px; }
ul { margin-bottom: 16px; padding-left: 20px; }
li { margin-bottom: 8px; }
a { color: #2563eb; text-decoration: none; }
blockquote { border-left: 4px solid #cbd5e1; margin: 0; padding-left: 16px; color: #64748b; }
code { background: #f1f5f9; padding: 2px 4px; border-radius: 4px; font-size: 0.9em; }
</style>
</head>
<body>
${htmlContent}
</body>
</html>`
}
